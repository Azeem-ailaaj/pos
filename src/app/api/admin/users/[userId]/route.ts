import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { revalidateTag } from "next/cache"

const prisma = new PrismaClient()

// Get user details
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const resolvedParams = await params
  
  try {
    const user = await prisma.user.findUnique({
      where: { id: resolvedParams.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        permissions: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    )
  }
}

// Update user permissions
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const resolvedParams = await params
  
  try {
    const { permissions } = await req.json()

    // Update user permissions in database
    const updatedUser = await prisma.user.update({
      where: { id: resolvedParams.userId },
      data: { permissions },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        permissions: true,
      },
    })

    // Force revalidation of the session
    revalidateTag('session')

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: "Failed to update user permissions" },
      { status: 500 }
    )
  }
}

// Delete user
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const resolvedParams = await params
  
  try {
    await prisma.user.delete({
      where: { id: resolvedParams.userId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    )
  }
}