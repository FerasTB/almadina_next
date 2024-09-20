"use client"
import UserSidebar from '@/components/UserLayout';
import Header from '@/components/Header';

export default function UserLayout({ children, }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex-1 flex flex-col" dir="rtl">
      {children}
    </div>
  );
}
