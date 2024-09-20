'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2, Calendar as CalendarIcon, Clock } from 'lucide-react'
import { useAuth } from '@/components/AuthContext'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { format, addDays } from "date-fns"
import { ar } from 'date-fns/locale'
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Notification } from '@/components/Notification'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TripPoint {
  name: string
  timeToNext: number
}

export default function AdminAddTrip() {
  const { token } = useAuth()
  const [seatCount, setSeatCount] = useState<number | null>(null)
  const [costPerSeat, setCostPerSeat] = useState<string>('')
  const [tripPoints, setTripPoints] = useState<TripPoint[]>([{ name: '', timeToNext: 0 }])
  const [tripDate, setTripDate] = useState<Date | undefined>(undefined)
  const [tripTime, setTripTime] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | '' } | null>(null)
  const router = useRouter()

  const [hours, setHours] = useState<number>(12)
  const [minutes, setMinutes] = useState<number>(0)
  const [ampm, setAmpm] = useState<'ص' | 'م'>('ص')

  const handleSeatCountSelect = (count: number) => {
    setSeatCount(count)
  }

  const handleAddTripPoint = () => {
    setTripPoints([...tripPoints, { name: '', timeToNext: 0 }])
  }

  const handleRemoveTripPoint = (index: number) => {
    const newTripPoints = tripPoints.filter((_, i) => i !== index)
    setTripPoints(newTripPoints)
  }

  const handleTripPointChange = (index: number, field: keyof TripPoint, value: string) => {
    const newTripPoints = [...tripPoints]
    if (field === 'timeToNext') {
      newTripPoints[index][field] = parseInt(value) || 0
    } else {
      newTripPoints[index][field] = value
    }
    setTripPoints(newTripPoints)
  }

  const handleDateSelect = (value: string | Date | undefined) => {
    if (typeof value === 'string') {
      const today = new Date()
      switch (value) {
        case 'today':
          setTripDate(today)
          break
        case 'tomorrow':
          setTripDate(addDays(today, 1))
          break
        default:
          setTripDate(undefined)
      }
    } else {
      setTripDate(value)
    }
  }

  const handleTimeChange = () => {
    let hour = hours
    if (ampm === 'م' && hour !== 12) hour += 12
    if (ampm === 'ص' && hour === 12) hour = 0
    setTripTime(`${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`);
  }

  useEffect(() => {
    handleTimeChange()
  }, [hours, minutes, ampm])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    const tripData = {
      seat_count: seatCount,
      passenger_cost: parseFloat(costPerSeat),
      points: tripPoints,
      trip_day: tripDate ? format(tripDate, 'yyyy-MM-dd') : '',
      departure_time: tripTime, // already in HH:mm:ss format
      trip_time: tripTime,      // already in HH:mm:ss format
      note: '',
      template_id: 1
    };
  
    try {
      const response = await fetch('https://madinaback.flaamingo.com/api/admin/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(tripData)
      });
  
      if (response.ok) {
        setNotification({ message: 'تمت إضافة الرحلة بنجاح! جاري إعادة التوجيه...', type: 'success' });
        setTimeout(() => {
          router.push('/admin/trips');
        }, 2000);
      } else {
        const errorData = await response.json();
        setNotification({ message: 'فشل في إضافة الرحلة. يرجى التحقق من الحقول والمحاولة مرة أخرى.', type: 'error' });
        console.error('Error adding trip:', errorData);
      }
    } catch (error) {
      setNotification({ message: 'خطأ في الشبكة. يرجى المحاولة لاحقًا.', type: 'error' });
      console.error('Network error:', error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto p-4" dir="rtl">
      <Notification message={notification?.message} type={notification?.type} />

      <Card>
        <CardHeader>
          <CardTitle>إضافة رحلة جديدة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>عدد المقاعد</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {[12, 24, 50].map((count) => (
                <Button
                  key={count}
                  type="button"
                  variant={seatCount === count ? "default" : "outline"}
                  onClick={() => handleSeatCountSelect(count)}
                  className="w-20 h-20 text-2xl"
                  disabled={count !== 50}
                >
                  {count}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="costPerSeat">تكلفة المقعد</Label>
            <Input
              id="costPerSeat"
              type="number"
              value={costPerSeat}
              onChange={(e) => setCostPerSeat(e.target.value)}
              placeholder="أدخل تكلفة المقعد"
              className="text-right"
            />
          </div>
          <div>
            <Label>نقاط التوقف</Label>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">اسم النقطة</TableHead>
                  <TableHead className="text-right">المدة للنقطة التالية (بالدقائق)</TableHead>
                  <TableHead className="text-right">الإجراء</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tripPoints.map((point, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Input
                        value={point.name}
                        onChange={(e) => handleTripPointChange(index, 'name', e.target.value)}
                        placeholder="أدخل اسم النقطة"
                        className="text-right"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={point.timeToNext}
                        onChange={(e) => handleTripPointChange(index, 'timeToNext', e.target.value)}
                        placeholder="المدة للنقطة التالية"
                        className="text-right"
                        disabled={index === tripPoints.length - 1}
                      />
                    </TableCell>
                    <TableCell>
                      {index !== tripPoints.length - 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => handleRemoveTripPoint(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button type="button" onClick={handleAddTripPoint} className="mt-2">
              <Plus className="h-4 w-4 ml-2" /> إضافة نقطة
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>تاريخ الرحلة</Label>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-right font-normal",
                      !tripDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="ml-2 h-4 w-4" />
                    {tripDate ? format(tripDate, 'PPP', { locale: ar }) : <span>اختر تاريخاً</span>}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>اختر التاريخ</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Select onValueChange={handleDateSelect}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر خياراً" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">اليوم</SelectItem>
                        <SelectItem value="tomorrow">غداً</SelectItem>
                        <SelectItem value="custom">تاريخ مخصص</SelectItem>
                      </SelectContent>
                    </Select>
                    <Calendar
                      mode="single"
                      selected={tripDate}
                      onSelect={handleDateSelect}
                      initialFocus
                      locale={ar}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div>
              <Label>وقت الرحلة</Label>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-right font-normal",
                      !tripTime && "text-muted-foreground"
                    )}
                  >
                    <Clock className="ml-2 h-4 w-4" />
                    {tripTime || <span>اختر الوقت</span>}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>اختر الوقت</DialogTitle>
                  </DialogHeader>
                  <div className="flex justify-center py-4">
                    <div className="flex space-x-2 space-x-reverse">
                      <ScrollArea className="h-[200px] w-[60px] rounded-md border">
                        <div className="p-4">
                          {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                            <div
                              key={hour}
                              className={`cursor-pointer p-2 text-center ${hours === hour ? 'bg-primary text-primary-foreground' : ''}`}
                              onClick={() => setHours(hour)}
                            >
                              {hour}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                      <ScrollArea className="h-[200px] w-[60px] rounded-md border">
                        <div className="p-4">
                          {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                            <div
                              key={minute}
                              className={`cursor-pointer p-2 text-center ${minutes === minute ? 'bg-primary text-primary-foreground' : ''}`}
                              onClick={() => setMinutes(minute)}
                            >
                              {minute.toString().padStart(2, '0')}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                      <ScrollArea className="h-[200px] w-[60px] rounded-md border">
                        <div className="p-4">
                          {['ص', 'م'].map((period) => (
                            <div
                              key={period}
                              className={`cursor-pointer p-2 text-center ${ampm === period ? 'bg-primary text-primary-foreground' : ''}`}
                              onClick={() => setAmpm(period as 'ص' | 'م')}
                            >
                              {period}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            {loading ? "جاري الإرسال..." : "إضافة الرحلة"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}