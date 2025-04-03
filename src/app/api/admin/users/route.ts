import { NextResponse } from "next/server"
import { db } from "@/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        userPermissions: true, // Changed from permissions to userPermissions
        createdAt: true,
      }
    })

    // Transform the data to match the expected format
    const transformedUsers = users.map(user => ({
      ...user,
      permissions: user.userPermissions.map(p => ({
        resource: p.resource,
        action: p.action
      }))
    }))

    return NextResponse.json(transformedUsers)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}
