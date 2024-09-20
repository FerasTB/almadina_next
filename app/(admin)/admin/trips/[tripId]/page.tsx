"use client";
import { useRouter } from 'next/router'
import AdminTripDetails from '@/components/AdminTripDetails'

export default function AdminTripDetailsPage({params} : {
  params : {
    tripId: string,
  }
}) {
  // const router = useRouter()
  const tripId = params.tripId

  return <AdminTripDetails tripId={Number(tripId)} />
}