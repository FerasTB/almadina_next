"use client"; // Ensure this is a Client Component

import Link from "next/link";
import {
  Home,
  Package,
  Book,
  Settings,
  LineChart,
  Menu,
  SquareUser,
} from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

export default function UserLayout({ children }) {
  return (
    <div className="flex h-screen">
      <aside className="fixed left-0 top-0 h-full w-16 bg-blue-800 text-white flex flex-col">
        <div className="border-b p-2">
          <Button variant="outline" size="icon" aria-label="Home">
            <Home className="size-5 fill-foreground" />
          </Button>
        </div>
        <nav className="flex-1 p-2 space-y-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/user">
                  <Button variant="ghost" size="icon" className="rounded-lg">
                    <Home className="size-5" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Home
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/user/trips">
                  <Button variant="ghost" size="icon" className="rounded-lg">
                    <Package className="size-5" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Trips
              </TooltipContent>
            </Tooltip>
            {/* Add more navigation items as needed */}
          </TooltipProvider>
        </nav>
        <nav className="p-2 space-y-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-lg">
                  <SquareUser className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Account
              </TooltipContent>
            </Tooltip>
            {/* Add more footer navigation items as needed */}
          </TooltipProvider>
        </nav>
      </aside>
      <main className="ml-16 p-4 w-full">
        {children}
      </main>
    </div>
  );
}
