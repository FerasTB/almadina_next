'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Bus, Calendar } from 'lucide-react';
import { useAuth } from '@/components/AuthContext';
import { withAdminAuth } from '@/components/withAdminAuth';
import useSWR from 'swr';

interface DashboardStats {
  totalUsers: number;
  totalTrips: number;
  upcomingTrips: number;
}

const fetcher = (url: string, token: string) => fetch(url, {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
  }
}).then(res => res.json());

function AdminDashboard() {
  const { token } = useAuth();

  // Use SWR for data fetching
  const { data: stats, error } = useSWR<DashboardStats>(
    token ? 'https://madinaback.flaamingo.com/api/admin/dashboard-stats' : null,
    (url) => fetcher(url, token)
  );

  if (error) return <div>فشل في جلب بيانات لوحة التحكم</div>;
  if (!stats) return <div>جارٍ تحميل البيانات...</div>;

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-3xl font-bold mb-6">لوحة التحكم الإدارية</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المستخدمين</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الرحلات</CardTitle>
            <Bus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTrips}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الرحلات القادمة</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingTrips}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default withAdminAuth(AdminDashboard);
