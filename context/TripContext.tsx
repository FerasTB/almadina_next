"use client"
import React, { createContext, useContext, useState } from 'react';


interface Trip {
    id: number;
    from: string;
    to: string;
    date: string;
    time: string;
    seatCount: number;
    availableSeats: number;
  }
interface TripContextType {
  trips: Trip[];
  setTrips: (trips: Trip[]) => void;
  addTrip: (trip: Trip) => void;
  removeTrip: (id: number) => void;
  clearTrips: () => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const useTripContext = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTripContext must be used within a TripProvider');
  }
  return context;
};

export const TripProvider = ({ children }: { children: React.ReactNode }) => {
  const [trips, setTrips] = useState<Trip[]>([]);

  const addTrip = (trip: Trip) => {
    setTrips(prevTrips => [...prevTrips, trip]);
  };

  const removeTrip = (id: number) => {
    setTrips(prevTrips => prevTrips.filter(trip => trip.id !== id));
  };

  const clearTrips = () => {
    setTrips([]);
  };

  return (
    <TripContext.Provider value={{ trips, setTrips, addTrip, removeTrip, clearTrips }}>
      {children}
    </TripContext.Provider>
  );
};
