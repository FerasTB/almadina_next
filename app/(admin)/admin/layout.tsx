"use client"
import AdminLayout from '@/components/AdminLayout';
import UserSidebar from '@/components/AdminLayout';
import AppLayout from '@/components/AppLayout';
import Header from '@/components/Header';
import { BookingProvider } from '@/context/BookingContext';

export default function Layout({ children, }: Readonly<{ children: React.ReactNode }>) {
  return (
      <AppLayout isAdmin>
        <BookingProvider>
      <div className="flex-1 flex flex-col" dir="rtl">
        {children}
      </div>
      </BookingProvider>
</AppLayout>
  );
}