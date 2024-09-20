'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckIcon, XIcon, UserIcon, Loader2 } from 'lucide-react'
import { useAuth } from './AuthContext'
import { Notification } from '@/components/Notification'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { fetchBookings, fetchUsers, handleBookingAction } from '@/services/bookingService'

interface Booking {
  bookingIds: number[]
  seatNumbers: number[]
  paymentCode: string
  status: 'pending' | 'approved' | 'rejected'
  userFullName: string
}

interface User {
  id: number
  name: string
}

interface AdminBookingManagementProps {
  tripId: number
}

export default function Component({ tripId }: AdminBookingManagementProps) {
  const { token } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedBookingIds, setSelectedBookingIds] = useState<number[]>([])
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [fetching, setFetching] = useState<boolean>(true)
  const hasFetched = useRef(false)

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  const fetchData = useCallback(async () => {
    if (hasFetched.current) return
    hasFetched.current = true

    setFetching(true)
    try {
      const [bookingsData, usersData] = await Promise.all([
        fetchBookings(tripId, token),
        fetchUsers(token),
      ])

      setBookings(bookingsData)
      setUsers(usersData)
    } catch (error) {
      console.error('Error fetching data:', error)
      setNotification({ message: 'فشل في جلب البيانات', type: 'error' })
    } finally {
      setFetching(false)
    }
  }, [tripId, token])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleAction = useCallback(
    async (action: 'approve' | 'reject', bookingIds: number[], userId?: number) => {
      setLoading(true)
      try {
        const result = await handleBookingAction(action, bookingIds, token, userId)
        setBookings((prev) =>
          prev.map((booking) => ({
            ...booking,
            status: booking.bookingIds.some((id) => bookingIds.includes(id))
              ? action === 'approve'
                ? 'approved'
                : 'rejected'
              : booking.status,
          }))
        )
        setSelectedBookingIds((prev) => prev.filter((id) => !bookingIds.includes(id)))
        setNotification({ message: result.message, type: 'success' })
      } catch (error) {
        setNotification({ message: `حدث خطأ أثناء ${action === 'approve' ? 'الموافقة على' : 'رفض'} الحجوزات.`, type: 'error' })
      } finally {
        setLoading(false)
      }
    },
    [token]
  )

  const handleSelectBooking = (booking: Booking) => {
    if (booking.status === 'approved') return

    setSelectedBookingIds((prev) =>
      prev.includes(booking.bookingIds[0])
        ? prev.filter((id) => !booking.bookingIds.includes(id))
        : [...prev, ...booking.bookingIds]
    )
  }

  const handleApproveSelected = () => {
    if (selectedBookingIds.length > 0) {
      handleAction('approve', selectedBookingIds)
    } else {
      setNotification({ message: 'الرجاء تحديد الحجوزات المراد الموافقة عليها', type: 'error' })
    }
  }

  const handleApproveRejectedForUser = () => {
    if (selectedBookingIds.length > 0 && selectedUserId) {
      handleAction('approve', selectedBookingIds, selectedUserId)
    } else {
      setNotification({ message: 'الرجاء تحديد الحجوزات والمستخدم', type: 'error' })
    }
  }

  const handleApproveByPaymentCode = (paymentCode: string) => {
    const bookingIdsToApprove = bookings
      .filter((booking) => booking.paymentCode === paymentCode && booking.status === 'pending')
      .flatMap((booking) => booking.bookingIds)
    handleAction('approve', bookingIdsToApprove)
  }

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500'
      case 'approved':
        return 'bg-green-500'
      case 'rejected':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }, [])

  const groupedBookings = useMemo(() => {
    return bookings.reduce((acc, booking) => {
      if (!acc[booking.paymentCode]) {
        acc[booking.paymentCode] = []
      }
      acc[booking.paymentCode].push(booking)
      return acc
    }, {} as Record<string, Booking[]>)
  }, [bookings])
  
  const renderBookingCard = (booking: Booking, showCheckbox: boolean = true) => (
    <Card
      key={booking.bookingIds.join('-')}
      className={`p-4 hover:shadow-md transition-shadow duration-200 ${
        booking.status !== 'approved' ? 'cursor-pointer' : ''
      } ${
        selectedBookingIds.some(id => booking.bookingIds.includes(id)) ? 'bg-primary/10' : ''
      }`}
      onClick={() => booking.status !== 'approved' && handleSelectBooking(booking)}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0" dir="rtl">
        <div className="flex items-center space-x-4 space-x-reverse">
          {showCheckbox && booking.status !== 'approved' && (
            <Checkbox
              checked={booking.bookingIds.every(id => selectedBookingIds.includes(id))}
              onCheckedChange={() => handleSelectBooking(booking)}
              className="pointer-events-none"
            />
          )}
          <div className="flex flex-col space-y-1" dir="rtl">
            <span className="text-sm text-right">أرقام المقاعد: {booking.seatNumbers.join(', ')}</span>
            <span className="text-sm text-right">رمز الدفع: {booking.paymentCode}</span>
            <span className="text-sm text-right">اسم المستخدم: {booking.userFullName}</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 sm:space-x-reverse">
          <Badge className={`${getStatusColor(booking.status)} text-white px-2 py-1 rounded-full`}>
            {booking.status === 'pending' ? 'معلق' : booking.status === 'approved' ? 'مقبول' : 'متاح'}
          </Badge>
          {booking.status === 'pending' && (
            <div className="flex space-x-2 space-x-reverse">
              <Button 
                onClick={(e) => {
                  e.stopPropagation()
                  handleAction('approve', booking.bookingIds)
                }} 
                size="sm"
                variant="outline"
                className="flex items-center"
                disabled={loading}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <CheckIcon className="w-4 h-4 ml-2" />}
                {loading ? 'جار المعالجة...' : 'قبول'}
              </Button>
              <Button 
                onClick={(e) => {
                  e.stopPropagation()
                  handleAction('reject', booking.bookingIds)
                }} 
                size="sm"
                variant="destructive"
                className="flex items-center"
                disabled={loading}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <XIcon className="w-4 h-4 ml-2" />}
                {loading ? 'جار المعالجة...' : 'رفض'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  )

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <Notification message={notification?.message} type={notification?.type} />
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
          <CardTitle className="text-2xl font-bold">إدارة الحجوزات</CardTitle>
          <Button
            onClick={handleApproveSelected}
            disabled={selectedBookingIds.length === 0 || loading}
            className="flex items-center w-full sm:w-auto"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <CheckIcon className="w-4 h-4 ml-2" />}
            {loading ? 'جار المعالجة...' : `الموافقة على المحدد (${selectedBookingIds.length})`}
          </Button>
        </CardHeader>
        <CardContent>
          {fetching ? (
            <p>جاري تحميل البيانات...</p>
          ) : (
            <Tabs defaultValue="grouped">
              <TabsList className="w-full mb-4 overflow-x-auto flex flex-nowrap">
                <TabsTrigger value="grouped" className="flex-1 whitespace-nowrap">مجمعة حسب رمز الدفع</TabsTrigger>
                <TabsTrigger value="individual" className="flex-1 whitespace-nowrap">فردية</TabsTrigger>
                <TabsTrigger value="rejected" className="flex-1 whitespace-nowrap">تحديد مستخدم</TabsTrigger>
              </TabsList>
              <TabsContent value="grouped">
                <ScrollArea className="h-[calc(100vh-350px)]">
                  <div className="space-y-4">
                    {Object.entries(groupedBookings).map(([paymentCode, groupBookings]) => (
                      <Card key={paymentCode} className="p-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 space-y-2 sm:space-y-0">
                          <h3 className="text-lg font-semibold">رمز الدفع: {paymentCode}</h3>
                          {groupBookings.some(booking => booking.status === 'pending') && (
                            <Button
                              onClick={() => handleApproveByPaymentCode(paymentCode)}
                              size="sm"
                              variant="outline"
                              className="flex items-center w-full sm:w-auto"
                              disabled={loading}
                            >
                              {loading ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <CheckIcon className="w-4 h-4 ml-2" />}
                              {loading ? 'جار المعالجة...' : 'قبول الكل'}
                            </Button>
                          )}
                        </div>
                        <div className="space-y-2">
                          {groupBookings.map(booking => renderBookingCard(booking, false))}
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="individual">
                <ScrollArea className="h-[calc(100vh-350px)]">
                  <div className="space-y-4">
                    {bookings
                      .filter(booking => booking.status !== 'approved')
                      .map(booking => renderBookingCard(booking))}
                    {bookings
                      .filter(booking => booking.status === 'approved')
                      .map(booking => renderBookingCard(booking, false))}
                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="rejected">
                <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 sm:space-x-reverse">
                  <Select onValueChange={value => setSelectedUserId(Number(value))}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue placeholder="اختر المستخدم" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map(user => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleApproveRejectedForUser}
                    disabled={selectedBookingIds.length === 0 || !selectedUserId || loading}
                    className="flex items-center w-full sm:w-auto"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <UserIcon className="w-4 h-4 ml-2" />}
                    {loading ? 'جار المعالجة...' : 'تعيين للمستخدم وقبول'}
                  </Button>
                </div>
                <ScrollArea className="h-[calc(100vh-400px)]">
                  <div className="space-y-4">
                    {bookings
                      .filter(booking => booking.status === 'rejected')
                      .map(booking => renderBookingCard(booking))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  )
}