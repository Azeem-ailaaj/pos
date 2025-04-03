import { NextResponse } from "next/server"
import { db } from "@/db"

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const resolvedParams = await params
  
  try {
    const { permissions } = await req.json()

    // Delete existing permissions
    await db.userPermission.deleteMany({
      where: { userId: resolvedParams.userId }
    })

    // Create new permissions
    await db.userPermission.createMany({
      data: permissions.map((p: any) => ({
        userId: resolvedParams.userId,
        resource: p.resource,
        action: p.action
      }))
    })

    // Fetch updated user with permissions
    const user = await db.user.findUnique({
      where: { id: resolvedParams.userId },
      include: { userPermissions: true }
    })

    // Transform permissions for response
    const updatedPermissions = user?.userPermissions.map(p => ({
      resource: p.resource,
      action: p.action
    }))

    return NextResponse.json({ 
      ...user, 
      permissions: updatedPermissions 
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: "Failed to update permissions" },
      { status: 500 }
    )
  }
}