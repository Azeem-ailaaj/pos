import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { startOfMonth, eachDayOfInterval, format } from "date-fns"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const total = await prisma.brand.count()
    const startDate = startOfMonth(new Date())
    
    const brands = await prisma.brand.findMany({
      where: {
        createdAt: {
          gte: startDate
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    const days = eachDayOfInterval({
      start: startDate,
      end: new Date()
    })

    // Ensure dates are properly formatted as ISO strings
    const trend = days.map(day => {
      const dayString = format(day, 'yyyy-MM-dd')
      const count = brands.filter(brand => 
        format(brand.createdAt, 'yyyy-MM-dd') === dayString
      ).length

      return {
        date: day.toISOString(), // Use ISO string format
        count
      }
    })

    return NextResponse.json({
      total,
      trend
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json(
      { error: "Failed to fetch brand statistics" },
      { status: 500 }
    )
  }
}