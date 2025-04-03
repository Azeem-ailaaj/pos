import { NextResponse } from "next/server"
import { db } from "@/db"

const DEFAULT_ADMIN_PERMISSIONS = [
  { resource: "admin", action: "access_admin_panel" },
  { resource: "locations", action: "view" },
  { resource: "locations", action: "edit" },
  { resource: "users", action: "view" },
  { resource: "users", action: "edit" },
  { resource: "settings", action: "view" },
  { resource: "settings", action: "edit" }
]

export async function POST(req: Request) {
  try {
    const { userId } = await req.json()

    // Delete existing permissions
    await db.userPermission.deleteMany({
      where: { userId }
    })

    // Create new permissions
    await db.userPermission.createMany({
      data: DEFAULT_ADMIN_PERMISSIONS.map(p => ({
        userId,
        resource: p.resource,
        action: p.action
      }))
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to seed permissions" },
      { status: 500 }
    )
  }
}