import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

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