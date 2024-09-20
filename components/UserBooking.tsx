'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertCircle, CheckCircle2, CircleDashed, ShipWheel, DoorOpen } from 'lucide-react'
import { useAuth } from './AuthContext'
import { Notification } from '@/components/Notification'
import { fetchSeats, bookSeats, updatePaymentCode } from '@/services/seatService'

type SeatStatus = 'available' | 'approved' | 'pending' | 'selected'

interface Seat {
  id?: number
  seat_number: number
  status: SeatStatus
  paymentCode?: string
  forMe: boolean
} 

interface UserBookingProps {
  tripId: number
}

export default function Component({ tripId }: UserBookingProps) {
  const [seats, setSeats] = useState<Seat[]>([])
  const [paymentCode, setPaymentCode] = useState('later')
  const [pendingSeats, setPendingSeats] = useState<Seat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' | '' }>({ message: '', type: '' })
  const { token } = useAuth()
  const [paymentCodes, setPaymentCodes] = useState<{ [seatId: number]: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const hasFetched = useRef(false)

  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: '', type: '' })
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  const handlePaymentCodeChange = (seatId: number, newCode: string) => {
    setPaymentCodes((prevCodes) => ({
      ...prevCodes,
      [seatId]: newCode,
    }))
  }

  const handleUpdatePaymentCode = (seatId: number) => {
    const newPaymentCode = paymentCodes[seatId] || ''
    handlePaymentCodeUpdate(seatId, newPaymentCode)
  }

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true

    const loadSeats = async () => {
      setLoading(true)
      try {
        const seatData = await fetchSeats(tripId, token)
        setSeats(seatData)
        setError(null)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    loadSeats()
  }, [tripId, token])

  useEffect(() => {
    const newPendingSeats = seats.filter(seat => seat.status === 'pending' || seat.status === 'approved')
    setPendingSeats(newPendingSeats)
  }, [seats])

  const handleSeatClick = (seatId: number) => {
    setSeats(prev =>
      prev.map(seat => {
        if (seat.id === seatId) {
          if (seat.status === 'available') {
            return { ...seat, status: 'selected' }
          } else if (seat.status === 'selected') {
            return { ...seat, status: 'available' }
          }
        }
        return seat
      })
    )
  }

  const handleBooking = async () => {
    const selectedSeatIds = seats.filter(seat => seat.status === 'selected').map(seat => seat.id)
    if (selectedSeatIds.length === 0) {
      setNotification({ message: 'يرجى اختيار مقعد واحد على الأقل.', type: 'error' })
      return
    }
    setIsLoading(true)

    try {
      await bookSeats(tripId, selectedSeatIds, paymentCode, token)
      setSeats(prev =>
        prev.map(seat =>
          selectedSeatIds.includes(seat.id) ? { ...seat, status: 'pending', paymentCode } : seat
        )
      )
      setPaymentCode('later')
      setNotification({ message: 'تم ارسال التفاصيل و بانتظار الموافقة', type: 'success' })
    } catch (err) {
      setNotification({ message: err.message, type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaymentCodeUpdate = async (seatId: number, newPaymentCode: string) => {
    try {
      const updatedSeat = await updatePaymentCode(tripId, seatId, newPaymentCode, token)
      setSeats(prev =>
        prev.map(seat =>
          seat.id === seatId ? { ...seat, paymentCode: newPaymentCode } : seat
        )
      )
      setNotification({ message: updatedSeat.message, type: 'success' })
    } catch (err) {
      setNotification({ message: err.message, type: 'error' })
    }
  }

  const renderSeat = (seat: Seat, isSmall: boolean = false) => {
    let bgColor = 'bg-secondary'
    let textColor = 'text-secondary-foreground'
    let icon = null

    if (seat.status === 'approved') {
      bgColor = 'bg-destructive'
      textColor = 'text-destructive-foreground'
      icon = <AlertCircle className="h-3 w-3" />
    } else if (seat.status === 'pending') {
      bgColor = 'bg-warning'
      textColor = 'text-warning-foreground'
      icon = <CircleDashed className="h-3 w-3" />
    } else if (seat.status === 'selected') {
      bgColor = 'bg-primary'
      textColor = 'text-primary-foreground'
      icon = <CheckCircle2 className="h-3 w-3" />
    }

    return (
      <Button
        key={`${seat.id || 'virtual'}-${seat.seat_number}`}
        className={`${isSmall ? 'w-8 h-8' : 'w-10 h-10'} ${bgColor} ${textColor} flex flex-col items-center justify-center p-1 ${
          seat.status === 'available' || seat.status === 'selected' ? 'hover:brightness-90' : ''
        }`}
        onClick={() => handleSeatClick(seat.id ?? seat.seat_number)}
        disabled={seat.status === 'approved' || seat.status === 'pending'}
      >
        <span className={`${isSmall ? 'text-[8px]' : 'text-xs'}`}>{seat.seat_number}</span>
        {icon}
      </Button>
    )
  }

  const renderSeatLayout = () => {
    return (
      <div className="flex flex-col items-center space-y-2">
        <div className="flex justify-between w-full">
          <ShipWheel className="w-8 h-8" />
          {renderSeat(seats[0])}
        </div>
        <div className="flex space-x-2">
          <div className="flex flex-col space-y-1">
            {[...Array(12)].map((_, index) => (
              <div key={`left-${index}`} className="flex space-x-1">
                {renderSeat(seats[index * 2 + 1])}
                {renderSeat(seats[index * 2 + 2])}
              </div>
            ))}
          </div>
          <div className="w-8" /> {/* Space for aisle */}
          <div className="flex flex-col space-y-1">
            {[...Array(7)].map((_, index) => (
              <div key={`right-top-${index}`} className="flex space-x-1">
                {renderSeat(seats[index * 2 + 25])}
                {renderSeat(seats[index * 2 + 26])}
              </div>
            ))}
            <div className="h-20 flex items-center justify-center">
              <DoorOpen className="w-8 h-8 text-gray-400" />
            </div>
            {[...Array(3)].map((_, index) => (
              <div key={`right-bottom-${index}`} className="flex space-x-1">
                {renderSeat(seats[index * 2 + 39])}
                {renderSeat(seats[index * 2 + 40])}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center space-x-1">
          {seats.slice(45).map((seat) => renderSeat(seat))}
        </div>
      </div>
    )
  }

  if (loading) {
    return <p>جاري تحميل المقاعد...</p>
  }

  if (error) {
    return <p>خطأ: {error}</p>
  }

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <Notification message={notification.message} type={notification.type} />

      <h2 className="text-2xl font-bold mb-4">حجز المقاعد للرحلة رقم #{tripId}</h2>
      <Tabs defaultValue="select" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="select">اختر المقاعد</TabsTrigger>
          <TabsTrigger value="pending">المقاعد المحجوزة/المعلقة</TabsTrigger>
        </TabsList>
        <TabsContent value="select">
          <Card>
            <CardHeader>
              <CardTitle dir="rtl">اختر مقاعدك</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                {renderSeatLayout()}
              </ScrollArea>
              <div className="flex flex-wrap justify-between items-center mt-4 gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-secondary"></div>
                  <span className="text-sm">متاح</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-destructive"></div>
                  <span className="text-sm">محجوز</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-warning"></div>
                  <span className="text-sm">معلق</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-primary"></div>
                  <span className="text-sm">محدد</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <div className="w-full" dir="rtl">
              <Label htmlFor="payment-code">رمز الدفع (سيلغى الحجز خلال 3 ساعات في حال لم يتم اضافة رمز دفع صالح من خلال سيرياتيل كاش او MTN كاش او مركز فاتورة )</Label>
                <Input
                  id="payment-code"
                  value={paymentCode}
                  onChange={(e) => setPaymentCode(e.target.value)}
                  placeholder="أدخل رمز الدفع الخاص بك"
                  className="text-right"
                />
              </div>
              <Button onClick={handleBooking} className="w-full" disabled={isLoading}>
                {isLoading ? 'جاري معالجة الحجز...' : 'احجز المقاعد المحددة'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>مقاعدك المحجوزة/المعلقة</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingSeats.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>رقم المقعد</TableHead>
                      <TableHead>رمز الدفع</TableHead>
                      <TableHead>الإجراء</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingSeats.filter(seat => seat.forMe).map(seat => (
                      <TableRow key={seat.id || seat.seat_number}>
                        <TableCell>{seat.seat_number}</TableCell>
                        <TableCell>
                          {seat.status === 'approved' ? (
                            <span>{seat.paymentCode || 'غير متاح'}</span>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <Input
                                value={paymentCodes[seat.id || seat.seat_number] || seat.paymentCode || ''}
                                onChange={(e) => handlePaymentCodeChange(seat.id || seat.seat_number, e.target.value)}
                                placeholder="أدخل رمز الدفع"
                                className="text-right"
                              />
                              <Button
                                onClick={() => handleUpdatePaymentCode(seat.id || seat.seat_number)}
                                variant="outline"
                                size="sm"
                              >
                                تحديث
                              </Button>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {seat.status === 'pending' ? 'معلق' : 'مؤكد'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p>ليس لديك مقاعد محجوزة أو معلقة.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}