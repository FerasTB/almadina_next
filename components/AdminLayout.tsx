"use client"; // Ensure this is a Client Component

import { useState } from "react";
import Link from "next/link";
import {
  Home,
  Package,
  Users2,
  Settings,
  LineChart,
  Menu,
  Triangle,
  SquareTerminal,
  Bot,
  Code2,
  Book,
  Settings2,
  LifeBuoy,
  SquareUser,
} from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen">
      <aside className="fixed left-0 top-0 h-full w-16 bg-gray-800 text-white flex flex-col">
        <div className="border-b p-2">
          <Link href="/admin">
            <Button variant="outline" size="icon" aria-label="Home">
              <Triangle className="size-5 fill-foreground" />
            </Button>
          </Link>
        </div>
        <nav className="flex-1 p-2 space-y-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/admin">
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
                <Link href="/admin/trips">
                  <Button variant="ghost" size="icon" className="rounded-lg">
                    <Package className="size-5" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Trips
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/admin/users">
                  <Button variant="ghost" size="icon" className="rounded-lg">
                    <Users2 className="size-5" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Users
              </TooltipContent>
            </Tooltip>
            {/* Add more navigation items as needed */}
          </TooltipProvider>
        </nav>
        <nav className="p-2 space-y-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/admin/help">
                  <Button variant="ghost" size="icon" className="rounded-lg">
                    <LifeBuoy className="size-5" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Help
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/admin/account">
                  <Button variant="ghost" size="icon" className="rounded-lg">
                    <SquareUser className="size-5" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Account
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>
      <main className="ml-16 p-4 w-full">
        {children}
      </main>
    </div>
  );
}
