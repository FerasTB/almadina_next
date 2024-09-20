"use client"

import AppLayout from '@/components/AppLayout';
import Header from '@/components/Header';
import UserLayout from '@/components/UserLayout';

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // <div className="flex min-h-screen">
    /* <UserLayout>
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </UserLayout> */
    <AppLayout>
      <div className="flex-1 flex flex-col" dir="rtl">
        {children}
      </div>
    </AppLayout>
    // </div>
  );
}
