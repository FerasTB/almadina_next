'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CalendarIcon, MapPinIcon, Loader2, ArrowLeftIcon } from 'lucide-react'; // Loader icon for loading state
import { useAuth } from '@/components/AuthContext';
import { fetchTrips } from '@/services/tripUserService'; // Import the trip service
import UserBooking from '@/components/UserBooking'
import { withAuth } from '@/components/withAuth'
interface Trip {
  id: number;
  from: string;
  to: string;
  date: string;
  passenger_cost: number;
  availableSeats: number;
}

function TripList({ onSelectTrip }: { onSelectTrip: (trip: Trip) => void }) {
  const { token } = useAuth(); // Get the auth token
  const [trips, setTrips] = useState<Trip[]>([]); // State to store trips
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const hasFetched = useRef(false); // useRef to track whether trips have been fetched

  // Fetch trips once when the component mounts or when the token changes
  const fetchTripsData = useCallback(async () => {
    if (hasFetched.current) return; // Prevent multiple API calls
    hasFetched.current = true; // Mark data as fetched

    setLoading(true); // Start loading

    try {
      const data = await fetchTrips(token);
      setTrips(data.data); // Assuming trips are under `data`
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false); // End loading
    }
  }, [token]);

  // Trigger fetchTripsData when component mounts
  useEffect(() => {
    fetchTripsData();
  }, [fetchTripsData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        <span>جاري تحميل الرحلات...</span>
      </div>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <ScrollArea className="h-[calc(100vh-100px)] w-full rounded-md border p-4" dir="rtl">
      <div className="grid gap-4">
        {trips.map((trip) => (
          <Card key={trip.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{trip.from} إلى {trip.to}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <CalendarIcon className="h-4 w-4" />
                <span>{trip.date}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-2">
                <MapPinIcon className="h-4 w-4" />
                <span>{trip.from} - {trip.to}</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center mt-auto">
              <span className="text-lg font-bold">{trip.passenger_cost} ل.س</span>
              <Button onClick={() => onSelectTrip(trip)}>عرض التفاصيل</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}


function App() {
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  const handleSelectTrip = useCallback((trip: Trip) => {
    setSelectedTrip(trip);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedTrip(null);
    setIsBooking(false);
  }, []);

  const handleBook = useCallback(() => {
    setIsBooking(true);
  }, []);

  function TripDetails({ trip, onBack, onBook }: { trip: Trip, onBack: () => void, onBook: () => void }) {
    return (
      <Card className="w-full max-w-2xl mx-auto" dir="rtl">
        <CardHeader>
          <Button variant="ghost" onClick={onBack} className="mb-2">
            <ArrowLeftIcon className="mr-2 h-4 w-4" /> العودة إلى الرحلات
          </Button>
          <CardTitle>{trip.from} إلى {trip.to}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
            <CalendarIcon className="h-4 w-4" />
            <span>{trip.date}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
            <MapPinIcon className="h-4 w-4" />
            <span>{trip.from} - {trip.to}</span>
          </div>
          <p className="text-lg font-bold mb-4">السعر: {trip.passenger_cost} ل.س</p>
          <p className="text-md">المقاعد المتاحة: {trip.availableSeats}</p>
        </CardContent>
        <CardFooter>
          <Button onClick={onBook} className="w-full">احجز هذه الرحلة</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-3xl font-bold text-center mb-8">حجز رحلات الحافلة</h1>
      {!selectedTrip && (
        <TripList onSelectTrip={handleSelectTrip} />
      )}
      {selectedTrip && !isBooking && (
        <TripDetails trip={selectedTrip} onBack={handleBack} onBook={handleBook} />
      )}
      {selectedTrip && isBooking && (
        <div>
          <Button variant="ghost" onClick={handleBack} className="mb-4">
            <ArrowLeftIcon className="mr-2 h-4 w-4" /> العودة إلى تفاصيل الرحلة
          </Button>
          <UserBooking tripId={selectedTrip.id} seatCount={50} />
        </div>
      )}
    </div>
  );
}

export default withAuth(App);
