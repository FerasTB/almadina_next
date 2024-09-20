'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, Loader2 } from 'lucide-react'
import { useAuth } from '@/components/AuthContext'
import { format, differenceInMinutes } from 'date-fns'
import { ar } from 'date-fns/locale'
import { fetchUserBookings } from '@/services/bookingUserService'

interface Booking {
  id: number
  tripId: number
  status: 'pending' | 'approved'
  createdAt: string
  paymentCode?: string
  cancelDeadline?: string
}

export default function Component() {
  const { token } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const hasFetched = useRef(false)

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true

    const fetchBookings = async () => {
      try {
        const data = await fetchUserBookings(token)
        setBookings(data)
      } catch (error) {
        console.error('Error fetching bookings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [token])

  const renderBookingStatus = (booking: Booking) => {
    if (booking.status === 'pending') {
      const approvalDeadline = new Date(booking.cancelDeadline!)
      const now = new Date()
      const minutesRemaining = booking.cancelDeadline

      return (
        <div className="flex flex-col items-start">
          <Badge variant="warning" className="mb-2">قيد الانتظار</Badge>
          <div className="text-sm text-muted-foreground flex items-center">
            <Clock className="ml-1 h-4 w-4" />
            <span className="whitespace-nowrap">الوقت المتبقي: {minutesRemaining} د</span>
          </div>
        </div>
      )
    } else {
      return (
        <div className="flex flex-col items-start">
          <Badge variant="success" className="mb-2">تم التأكيد</Badge>
          <div className="text-sm font-medium flex items-center">
            <CheckCircle className="ml-1 h-4 w-4 text-green-500" />
            <span className="whitespace-nowrap">رمز الدفع: {booking.paymentCode}</span>
          </div>
        </div>
      )
    }
  }

  const renderBookingCard = (booking: Booking) => (
    <Card key={booking.id} className="mb-4">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-sm font-medium">رقم الحجز</p>
            <p className="text-lg">{booking.id}</p>
          </div>
          <div>
            <p className="text-sm font-medium">رقم الرحلة</p>
            <p className="text-lg">{booking.tripId}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm font-medium">تاريخ الحجز</p>
            <p className="text-lg">{format(new Date(booking.createdAt), 'PPP', { locale: ar })}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm font-medium mb-1">الحالة</p>
            {renderBookingStatus(booking)}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-3xl font-bold mb-6">لوحة التحكم الخاصة بك</h1>
      <Card>
        <CardHeader>
          <CardTitle>حجوزاتك</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="ml-2 h-6 w-6 animate-spin" />
              <span>جاري تحميل الحجوزات...</span>
            </div>
          ) : bookings.length === 0 ? (
            <p className="text-center py-4">لا توجد حجوزات متاحة.</p>
          ) : (
            <div className="space-y-4">
              {bookings.map(renderBookingCard)}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}