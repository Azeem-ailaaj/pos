import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import prisma from "@/lib/prisma"

export async function POST() {
  try {
    const session = await getServerSession()
    
    if (session) {
      // Clear session from database
      await prisma.session.deleteMany({
        where: {
          userId: session.user?.id
        }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 })
  }
}