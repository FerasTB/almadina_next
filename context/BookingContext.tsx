import React, { createContext, useContext, useState } from 'react';

interface Booking {
  bookingIds: number[];
  seatNumbers: number[];
  paymentCode: string;
  status: 'pending' | 'approved' | 'rejected';
  userFullName: string;
}

interface User {
  id: number;
  name: string;
}

interface BookingContextType {
  bookings: Booking[];
  users: User[];
  setBookings: (bookings: Booking[]) => void;
  setUsers: (users: User[]) => void;
  updateBookingStatus: (bookingIds: number[], newStatus: 'approved' | 'rejected') => void;
  clearBookings: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBookingContext = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookingContext must be used within a BookingProvider');
  }
  return context;
};

export const BookingProvider = ({ children }: { children: React.ReactNode }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const updateBookingStatus = (bookingIds: number[], newStatus: 'approved' | 'rejected') => {
    setBookings(prevBookings =>
      prevBookings.map(booking =>
        booking.bookingIds.some(id => bookingIds.includes(id))
          ? { ...booking, status: newStatus }
          : booking
      )
    );
  };

  const clearBookings = () => {
    setBookings([]);
  };

  return (
    <BookingContext.Provider value={{ bookings, users, setBookings, setUsers, updateBookingStatus, clearBookings }}>
      {children}
    </BookingContext.Provider>
  );
};
