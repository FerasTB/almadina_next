"use client"
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertCircle, CheckCircle2, CircleDashed } from 'lucide-react'

const TOTAL_SEATS = 40
const ROWS = 10
const SEATS_PER_ROW = 4

type SeatStatus = 'available' | 'booked' | 'pending' | 'selected'

interface Seat {
  id: number
  status: SeatStatus
  paymentCode?: string
}

export default function UserBooking() {
  const [seats, setSeats] = useState<Seat[]>(
    Array.from({ length: TOTAL_SEATS }, (_, i) => ({
      id: i + 1,
      status: Math.random() > 0.7 ? 'booked' : 'available'
    }))
  )
  const [selectedSeats, setSelectedSeats] = useState<number[]>([])
  const [paymentCode, setPaymentCode] = useState('')
  const [pendingSeats, setPendingSeats] = useState<Seat[]>([])

  useEffect(() => {
    const newPendingSeats = seats.filter(seat => seat.status === 'pending')
    setPendingSeats(newPendingSeats)
  }, [seats])

  const handleSeatClick = (seatId: number) => {
    setSeats(prev => prev.map(seat => {
      if (seat.id === seatId) {
        if (seat.status === 'available') {
          return { ...seat, status: 'selected' }
        } else if (seat.status === 'selected') {
          return { ...seat, status: 'available' }
        }
      }
      return seat
    }))
  }

  const handleBooking = () => {
    const selectedSeatIds = seats.filter(seat => seat.status === 'selected').map(seat => seat.id)
    if (selectedSeatIds.length === 0) {
      alert('Please select at least one seat.')
      return
    }
    if (paymentCode.trim() === '') {
      alert('Please enter a payment code.')
      return
    }
    setSeats(prev => prev.map(seat => 
      selectedSeatIds.includes(seat.id) ? { ...seat, status: 'pending', paymentCode } : seat
    ))
    setPaymentCode('')
    alert('Booking submitted for approval!')
  }

  const handlePaymentCodeUpdate = (seatId: number, newPaymentCode: string) => {
    setSeats(prev => prev.map(seat => 
      seat.id === seatId ? { ...seat, paymentCode: newPaymentCode } : seat
    ))
  }

  const renderSeat = (seat: Seat) => {
    let bgColor = 'bg-secondary'
    let textColor = 'text-secondary-foreground'
    let icon = null
    if (seat.status === 'booked') {
      bgColor = 'bg-destructive'
      textColor = 'text-destructive-foreground'
      icon = <AlertCircle className="h-4 w-4" />
    } else if (seat.status === 'pending') {
      bgColor = 'bg-warning'
      textColor = 'text-warning-foreground'
      icon = <CircleDashed className="h-4 w-4" />
    } else if (seat.status === 'selected') {
      bgColor = 'bg-primary'
      textColor = 'text-primary-foreground'
      icon = <CheckCircle2 className="h-4 w-4" />
    }

    return (
      <Button
        key={seat.id}
        className={`w-14 h-14 ${bgColor} ${textColor} flex flex-col items-center justify-center p-1 ${seat.status === 'available' || seat.status === 'selected' ? 'hover:brightness-90' : ''}`}
        onClick={() => handleSeatClick(seat.id)}
        disabled={seat.status === 'booked' || seat.status === 'pending'}
      >
        <span className="text-xs">{seat.id}</span>
        {icon}
      </Button>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="select" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="select">Select Seats</TabsTrigger>
          <TabsTrigger value="pending">Pending Bookings</TabsTrigger>
        </TabsList>
        <TabsContent value="select">
          <Card>
            <CardHeader>
              <CardTitle>Select Your Seats</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10">
                  {seats.map(renderSeat)}
                </div>
              </ScrollArea>
              <div className="flex flex-wrap justify-between items-center mt-4 gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-secondary"></div>
                  <span className="text-sm">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-destructive"></div>
                  <span className="text-sm">Booked</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-warning"></div>
                  <span className="text-sm">Pending</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-primary"></div>
                  <span className="text-sm">Selected</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <div className="w-full">
                <Label htmlFor="payment-code">Payment Code</Label>
                <Input 
                  id="payment-code" 
                  value={paymentCode} 
                  onChange={(e) => setPaymentCode(e.target.value)}
                  placeholder="Enter your payment code"
                />
              </div>
              <Button onClick={handleBooking} className="w-full">
                Book Selected Seats
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Your Pending Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingSeats.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Seat Number</TableHead>
                      <TableHead>Payment Code</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingSeats.map((seat) => (
                      <TableRow key={seat.id}>
                        <TableCell>{seat.id}</TableCell>
                        <TableCell>
                          <Input 
                            value={seat.paymentCode || ''} 
                            onChange={(e) => handlePaymentCodeUpdate(seat.id, e.target.value)}
                            placeholder="Enter payment code"
                          />
                        </TableCell>
                        <TableCell>
                          <Button 
                            onClick={() => alert(`Updated payment code for seat ${seat.id}`)}
                            variant="outline"
                            size="sm"
                          >
                            Update
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p>You have no pending bookings.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}