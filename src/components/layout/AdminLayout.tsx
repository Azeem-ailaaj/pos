"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Tags,
  User,
  Settings,
  Menu,
  LogOut,
  ChevronLeft,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const { data: session } = useSession();

  const menuItems = [
    { 
      icon: LayoutDashboard, 
      label: "Dashboard", 
      href: "/admin/dashboard" 
    },
    { 
      icon: Tags, 
      label: "Brands", 
      href: "/admin/brands" 
    },
    { 
      icon: User, 
      label: "Profile", 
      href: "/admin/profile" 
    },
    { 
      icon: Settings, 
      label: "Settings", 
      href: "/admin/settings" 
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 h-full bg-white border-r transition-all duration-300 z-50",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h1
            className={cn(
              "font-bold transition-all duration-300",
              collapsed ? "scale-0" : "scale-100"
            )}
          >
            Admin Panel
          </h1>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
        <nav className="p-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <item.icon size={20} />
              <span
                className={cn(
                  "transition-all duration-300",
                  collapsed ? "hidden" : "block"
                )}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div
        className={cn(
          "transition-all duration-300 min-h-screen",
          collapsed ? "ml-16" : "ml-64"
        )}
      >
        {/* Top Bar */}
        <div className="bg-white border-b sticky top-0 z-40">
          <div className="flex items-center justify-end px-6 py-3">
            <div className="flex items-center gap-4">
              <span className="text-sm">{session?.user?.email}</span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut size={20} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;