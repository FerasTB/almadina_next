"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Triangle, Home, Package, Users2, LifeBuoy, SquareUser, Menu, X } from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
}

const adminNavItems: NavItem[] = [
  { title: "لوحة التحكم", href: "/admin", icon: <Home className="w-5 h-5" /> },
  { title: "الرحلات", href: "/admin/trips", icon: <Package className="w-5 h-5" /> },
  { title: "المستخدمين", href: "/admin/users", icon: <Users2 className="w-5 h-5" /> },
]

const userNavItems: NavItem[] = [
  { title: "الرئيسية", href: "/user", icon: <Home className="w-5 h-5" /> },
  { title: "رحلاتي", href: "/user/trips", icon: <Package className="w-5 h-5" /> },
]

const footerNavItems: NavItem[] = [
  { title: "مساعدة", href: "/help", icon: <LifeBuoy className="w-5 h-5" />  },
  { title: "الحساب", href: "/account", icon: <SquareUser className="w-5 h-5" /> },
]

interface AppLayoutProps {
  children: React.ReactNode
  isAdmin?: boolean
}

export default function AppLayout({ children, isAdmin = false }: AppLayoutProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const navItems = isAdmin ? adminNavItems : userNavItems
  const bgColor = isAdmin ? "bg-gray-900" : "bg-blue-900"
  const textColor = "text-gray-100"
  const hoverColor = isAdmin ? "hover:bg-gray-800" : "hover:bg-blue-800"
  const activeColor = isAdmin ? "bg-gray-800" : "bg-blue-800"

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const NavItems = ({ isMobile = false }) => (
    <>
      {navItems.map((item, index) => (
        <Link key={index} href={item.href} dir="rtl" className="w-full">
          <Button
            variant={pathname === item.href ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start",
              isMobile ? "px-2 py-3" : "px-4 py-2",
              pathname === item.href ? activeColor : hoverColor,
              textColor
            )}
          >
            {item.icon}
            <span className={cn("mr-2", isMobile ? "text-base" : "text-sm")}>{item.title}</span>

          </Button>
        </Link>
      ))}
    </>
  )

  const FooterItems = ({ isMobile = false }) => (
    <>
      {footerNavItems.map((item, index) => (
        <Link key={index} href={item.href} dir="rtl" className="w-full">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start",
              isMobile ? "px-2 py-3" : "px-4 py-2",
              hoverColor,
              textColor
            )}
          >
            {item.icon}
            <span className={cn("mr-2", isMobile ? "text-base" : "text-sm")}>{item.title}</span>
          </Button>
        </Link>
      ))}
    </>
  )

  return (
    <div className="flex h-screen" dir="rtl"> {/* Added dir="rtl" for right-to-left layout */}
      {/* Sidebar for larger screens */}
      <aside
        className={cn(
          "hidden md:flex flex-col w-64 p-4",
          bgColor,
          textColor
        )}
      >
        <div className="flex items-center justify-center mb-8">
          <Triangle className="w-8 h-8" />
        </div>
        <ScrollArea className="flex-grow">
          <nav className="space-y-1">
            <NavItems />
          </nav>
        </ScrollArea>
        <nav className="mt-auto pt-4 border-t border-white/10 space-y-1">
          <FooterItems />
        </nav>
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden fixed top-4 right-4 z-40"
          >
            <Menu className="w-6 h-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className={cn("w-64 p-0", bgColor)} dir="rtl">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4">
              <Triangle className={cn("w-8 h-8", textColor)} />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
                className={textColor}
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
            <ScrollArea className="flex-grow">
              <nav className="space-y-1 p-4">
                <NavItems isMobile />
              </nav>
            </ScrollArea>
            <nav className="mt-auto p-4 border-t border-white/10 space-y-1">
              <FooterItems isMobile />
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4 py-8 md:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}
