import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PUT(
  request: Request,
  { params }: { params: { brandId: string } }
) {
  try {
    const body = await request.json()
    const brand = await prisma.brand.update({
      where: { id: params.brandId },
      data: {
        name: body.name,
        description: body.description,
        imageUrl: body.imageUrl,
        active: body.active, // Add active field here
      },
    })
    return NextResponse.json(brand)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update brand" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { brandId: string } }
) {
  try {
    await prisma.brand.delete({
      where: { id: params.brandId },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete brand" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { brandId: string } }
) {
  try {
    const json = await req.json()
    const brand = await prisma.brand.update({
      where: { id: params.brandId },
      data: {
        active: json.active,
      },
    })
    return NextResponse.json(brand)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update brand" },
      { status: 500 }
    )
  }
}