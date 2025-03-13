"use client"

import { useQuery } from "@tanstack/react-query"
import AdminLayout from "@/components/layout/AdminLayout"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface BrandStats {
  total: number
  trend: Array<{
    date: string
    count: number
  }>
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const { data: brandStats } = useQuery<BrandStats>({
    queryKey: ["brandStats"],
    queryFn: async () => {
      const response = await fetch("/api/brands/stats")
      if (!response.ok) throw new Error("Failed to fetch brand stats")
      return response.json()
    },
  })

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatsCard
            title="Total Brands"
            value={brandStats?.total || 0}
            data={brandStats?.trend || []}
          />
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Welcome</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{session?.user?.name}</p>
              <p className="text-xs text-muted-foreground">
                {session?.user?.email}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}