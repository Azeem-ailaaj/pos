import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { QueryProvider } from "@/providers/query-provider"; // ✅ Query Provider
import { Toaster } from "sonner";
import "./globals.css";
import { getServerSession } from "next-auth/next"
import { headers } from 'next/headers'
import { AuthProvider } from "@/providers/auth"
import LogoutSync from '@/components/LogoutSync'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()
  
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider session={session}>
          <QueryProvider> {/* ✅ Wrap inside QueryProvider */}
            <LogoutSync />
            {children}
            <Toaster position="top-center" />
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
