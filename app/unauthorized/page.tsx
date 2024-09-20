import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100" dir="rtl">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">دخول غير مصرح</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">ليس لديك الإذن للوصول إلى هذه الصفحة.</p>
          <Link href="/user">
            <Button>العودة إلى الصفحة الرئيسية</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
