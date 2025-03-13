"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Tags, Store, TrendingUp, TrendingDown } from "lucide-react"
import { format, parseISO, startOfDay, endOfDay, subDays } from "date-fns"
import prisma from "@/lib/prisma"

export async function BrandStats() {
  const now = new Date()
  const today = {
    start: startOfDay(now),
    end: endOfDay(now)
  }
  
  const yesterday = {
    start: startOfDay(subDays(now, 1)),
    end: endOfDay(subDays(now, 1))
  }

  const [totalBrands, todayBrands, yesterdayBrands] = await Promise.all([
    prisma.brand.count(),
    prisma.brand.count({
      where: {
        createdAt: {
          gte: today.start,
          lte: today.end
        }
      }
    }),
    prisma.brand.count({
      where: {
        createdAt: {
          gte: yesterday.start,
          lte: yesterday.end
        }
      }
    })
  ])

  const trend = todayBrands > yesterdayBrands ? 'up' : todayBrands < yesterdayBrands ? 'down' : 'neutral'

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Brands</CardTitle>
        <Store className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-3">
          <div className="text-2xl font-bold">{totalBrands}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            {trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500 mr-1" />}
            {trend === 'down' && <TrendingDown className="h-3 w-3 text-red-500 mr-1" />}
            <span>{todayBrands} today</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {yesterdayBrands} yesterday
        </p>
      </CardContent>
    </Card>
  )
}

interface StatsCardProps {
  title: string
  value: number
  data: Array<{
    date: string
    count: number
  }>
  trend: "positive" | "negative" | "neutral"
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    try {
      const date = parseISO(label)
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">
                Date
              </span>
              <span className="font-bold text-muted-foreground">
                {format(date, "MMM d")}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">
                Brands
              </span>
              <span className="font-bold">{payload[0].value}</span>
            </div>
          </div>
        </div>
      )
    } catch (error) {
      return null
    }
  }
  return null
}

export function StatsCard({ title, value, data, trend }: StatsCardProps) {
  const trendColor = {
    positive: "text-green-500",
    negative: "text-red-500",
    neutral: "text-blue-500"
  }[trend]

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">
          <div className="flex items-center gap-2">
            <Tags className="h-4 w-4 text-blue-500" />
            {title}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-3">
          <div className="text-2xl font-bold">{value}</div>
          <div className={`text-sm ${trendColor}`}>
            {trend === "positive" && "+"}
            {((data[data.length - 1]?.count || 0) - (data[0]?.count || 0))} Today
          </div>
        </div>
        <div className="h-[80px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" hide />
              <YAxis hide />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: '#f3f4f6' }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                fill="url(#colorCount)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}