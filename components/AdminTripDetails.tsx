"use client"
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdminBookingManagement from './AdminBookingManagement'
import { Edit, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from './AuthContext';

interface Trip {
  id: number
  from: string
  to: string
  date: string
  time: string
  seatCount: number
  availableSeats: number
}

export default function AdminTripDetails({ tripId }: { tripId: number }) {
  const [trip, setTrip] = useState<Trip | null>(null) // Set trip as null initially
  const [loading, setLoading] = useState(true) // Loading state for the data
  const [error, setError] = useState<string | null>(null) // Error state
  const { token } = useAuth();

  // Fetch trip data from the Laravel API
  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const response = await fetch(`https://madinaback.flaamingo.com/api/trips/${tripId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch trip data.')
        }

        const data = await response.json()
        setTrip(data.data) // Set the fetched trip data
      } catch (error) {
        setError('حدث خطأ أثناء تحميل بيانات الرحلة.')
      } finally {
        setLoading(false)
      }
    }

    fetchTripData()
  }, [tripId])

  // Loading state
  if (loading) {
    return <p>جاري تحميل بيانات الرحلة...</p>
  }

  // Error state
  if (error) {
    return <p>{error}</p>
  }

  // If no trip is found (API returns null or empty response)
  if (!trip) {
    return <p>لم يتم العثور على تفاصيل الرحلة.</p>
  }

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex justify-between items-center">
        <Link href="/admin/trips">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 ml-2" /> العودة إلى الرحلات
          </Button>
        </Link>
        <Button>
          <Edit className="h-4 w-4 ml-2" /> تعديل الرحلة
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>تفاصيل الرحلة رقم {trip.id}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">من:</p>
              <p>{trip.from}</p>
            </div>
            <div>
              <p className="font-semibold">إلى:</p>
              <p>{trip.to}</p>
            </div>
            <div>
              <p className="font-semibold">التاريخ:</p>
              <p>{trip.date}</p>
            </div>
            <div>
              <p className="font-semibold">الوقت:</p>
              <p>{trip.time}</p>
            </div>
            <div>
              <p className="font-semibold">إجمالي المقاعد:</p>
              <p>{trip.seatCount}</p>
            </div>
            <div>
              <p className="font-semibold">المقاعد المتاحة:</p>
              <p>{trip.availableSeats}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Tabs defaultValue="bookings">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="bookings">الحجوزات</TabsTrigger>
          <TabsTrigger value="statistics">الإحصائيات</TabsTrigger>
        </TabsList>
        <TabsContent value="bookings">
          <AdminBookingManagement tripId={trip.id} />
        </TabsContent>
        <TabsContent value="statistics">
          <Card>
            <CardHeader>
              <CardTitle>إحصائيات الرحلة</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add trip statistics here */}
              <p>إحصائيات الرحلة قادمة قريباً...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
