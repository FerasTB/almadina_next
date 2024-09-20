'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, User } from 'lucide-react';
import { useAuth } from '@/components/AuthContext';
import { Notification } from '@/components/Notification';
import { withAdminAuth } from '@/components/withAdminAuth';
import { fetchUsers, addUser } from '@/services/userService'; // Import the user service

interface UserData {
  id: number;
  first_name: string;
  last_name: string;
  middle_name?: string;
  mother_name?: string;
  phone: string;
}

function UserManagement() {
  const { token } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | '' } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState<Omit<UserData, 'id'>>({
    first_name: '',
    last_name: '',
    middle_name: '',
    mother_name: '',
    phone: '',
  });

  // Using useRef to track whether data has been fetched
  const hasFetched = useRef(false);

  // Use useRef to prevent multiple data fetching
  useEffect(() => {
    if (hasFetched.current) return; // If data has already been fetched, do nothing
    hasFetched.current = true; // Mark that the data has been fetched

    fetchUsersData();
  }, []); // Empty dependency array to only run this effect once

  const fetchUsersData = async () => {
    try {
      const usersData = await fetchUsers(token); // Use the fetchUsers service
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      setNotification({ message: 'فشل في جلب بيانات المستخدمين', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const addedUser = await addUser(newUser, token); // Use the addUser service
      setUsers((prev) => [...prev, addedUser]);
      setNotification({ message: 'تمت إضافة المستخدم بنجاح', type: 'success' });
      setIsDialogOpen(false);
      setNewUser({ first_name: '', last_name: '', middle_name: '', mother_name: '', phone: '' });
    } catch (error) {
      console.error('Error adding user:', error);
      setNotification({ message: 'فشل في إضافة المستخدم', type: 'error' });
    }
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <Notification message={notification?.message} type={notification?.type} />

      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>إدارة المستخدمين</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="ml-2 h-4 w-4" /> إضافة مستخدم
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>إضافة مستخدم جديد</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="first_name">الاسم الأول</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={newUser.first_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">اسم العائلة</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={newUser.last_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="middle_name">الاسم الأوسط</Label>
                  <Input
                    id="middle_name"
                    name="middle_name"
                    value={newUser.middle_name || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="mother_name">اسم الأم</Label>
                  <Input
                    id="mother_name"
                    name="mother_name"
                    value={newUser.mother_name || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={newUser.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">إضافة المستخدم</Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent dir="rtl">
          <p className="text-lg font-semibold mb-4">عدد المستخدمين: {users.length}</p>
          {loading ? (
            <p>جاري تحميل بيانات المستخدمين...</p>
          ) : (
            <ScrollArea className="h-[300px] w-full rounded-md border p-4" dir="rtl">
              {users.map((user) => (
                <div key={user.id} dir="rtl" className="flex items-center space-x-4 space-x-reverse mb-4 p-2 bg-secondary rounded-lg">
                  <User className="h-10 w-10 text-primary" />
                  <div>
                    <p className="font-semibold text-right">{user.name}</p>
                    <p className="text-sm text-muted-foreground text-right">{user.phone}</p>
                  </div>
                </div>
              ))}
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default withAdminAuth(UserManagement);
