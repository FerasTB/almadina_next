import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AddUserForm() {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Add New User</CardTitle>
        <CardDescription>
          Enter the user's information to add them to the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="John Doe" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" placeholder="+123456789" required />
          </div>
          <Button type="submit" className="w-full">
            Add User
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Want to view all users?{" "}
          <Link href="/admin/users" className="underline">
            View Users
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}