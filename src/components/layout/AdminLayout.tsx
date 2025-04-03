"use client";

import { cn } from "@/lib/utils";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Locations",
    href: "/admin/locations",
    icon: Building2,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { data: session } = useSession();

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <aside
        className={cn(
          "relative flex flex-col border-r bg-white transition-all duration-300 ease-in-out dark:bg-gray-800",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 z-40 flex h-6 w-6 items-center justify-center rounded-full border bg-white text-gray-600 dark:bg-gray-800 dark:text-gray-200"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>

        <div className="flex h-16 items-center justify-center border-b px-4">
          <h1 className={cn(
            "text-xl font-bold transition-all duration-300",
            collapsed ? "scale-0" : "scale-100"
          )}>
            Admin Panel
          </h1>
        </div>

        <nav className="flex-1 space-y-1 p-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-2 rounded-lg px-3 py-2 transition-all duration-200",
                pathname === item.href
                  ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white"
                  : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 flex-shrink-0",
                pathname === item.href
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-400"
              )} />
              <span className={cn(
                "transition-all duration-300",
                collapsed ? "scale-0" : "scale-100"
              )}>
                {item.title}
              </span>
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="border-b bg-white shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-end px-6 py-3">
            <div className="flex items-center gap-4">
              <span className="text-sm">{session?.user?.email}</span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Sign out</span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-gray-50 p-4 dark:bg-gray-900">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}