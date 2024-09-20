'use client'

import { useEffect, useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from '@/components/AuthContext'
import { withAdminAuth } from '@/components/withAdminAuth'
import { fetchTrips, deleteTrip } from '@/services/tripService'

interface Trip {
  id: number
  from: string
  to: string
  date: string
  time: string
  seatCount: number
  availableSeats: number
}

function AdminTripList() {
  const { token } = useAuth(); // Get the auth token
  const [trips, setTrips] = useState<Trip[]>([]); // Set default value to empty array
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const hasFetched = useRef(false); // useRef to track if data has been fetched already

  useEffect(() => {
    if (hasFetched.current) return; // If data has already been fetched, return immediately
    hasFetched.current = true; // Mark as fetched to prevent re-runs

    const getTrips = async () => {
      try {
        const tripData = await fetchTrips(token); // Use the fetchTrips service
        if (Array.isArray(tripData)) {
          console.log(tripData);
          setTrips(tripData); // Set trips data
        } else {
          throw new Error('Unexpected response format');
        }
      } catch (error) {
        setError('فشل في جلب الرحلات.');
      } finally {
        setLoading(false);
      }
    };

    getTrips();
  }, [token]);

  const handleDeleteTrip = async (id: number) => {
    try {
      await deleteTrip(id, token); // Use the deleteTrip service
      setTrips((prevTrips) => prevTrips.filter(trip => trip.id !== id));
    } catch (error) {
      setError('فشل في حذف الرحلة.');
    }
  }

  if (loading) {
    return <p>جاري تحميل الرحلات...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <Card dir="rtl">
      <CardHeader dir="rtl" className="flex flex-row items-center justify-between">
        <CardTitle dir="rtl">قائمة الرحلات</CardTitle>
        <Link href="/admin/trips/add" dir="rtl">
          <Button dir="rtl">
             إضافة رحلة جديدة <Plus className="h-4 w-4 mr-2" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-200px)]" dir="rtl">
          <div className="md:hidden" dir="rtl">
            {trips.length > 0 ? trips.map((trip) => (
              <div key={trip.id} className="mb-4 p-4 border rounded-lg" dir="rtl">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold" dir="rtl">{trip.from} إلى {trip.to}</h3>
                  <Link href={`/admin/trips/${trip.id}`} dir="rtl">
                    <Button variant="ghost" size="sm" dir="rtl">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <p className="text-sm text-gray-600">التاريخ: {trip.date} | الوقت: {trip.time}</p>
                <p className="text-sm text-gray-600">عدد المقاعد: {trip.seatCount} | المتاحة: {trip.availableSeats}</p>
                <div className="flex justify-end mt-2 space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteTrip(trip.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )) : <p>لا توجد رحلات.</p>}
          </div>
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='text-right'>من</TableHead>
                  <TableHead className='text-right'>إلى</TableHead>
                  <TableHead className='text-right'>التاريخ</TableHead>
                  <TableHead className='text-right'>الوقت</TableHead>
                  <TableHead className='text-right'>عدد المقاعد</TableHead>
                  <TableHead className='text-right'>المقاعد المتاحة</TableHead>
                  <TableHead className='text-right'>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trips.map((trip) => (
                  <TableRow key={trip.id}>
                    <TableCell>{trip.from}</TableCell>
                    <TableCell>{trip.to}</TableCell>
                    <TableCell>{trip.date}</TableCell>
                    <TableCell>{trip.time}</TableCell>
                    <TableCell>{trip.seatCount}</TableCell>
                    <TableCell>{trip.availableSeats}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Link href={`/admin/trips/${trip.id}`}>
                          <Button variant="outline" size="sm">
                            إدارة
                          </Button>
                        </Link>
                        <Button variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDeleteTrip(trip.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default withAdminAuth(AdminTripList);
