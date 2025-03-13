import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(brands);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch brands" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const brand = await prisma.brand.create({
      data: {
        name: json.name,
        active: json.active,
      },
    });
    return NextResponse.json(brand);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create brand" },
      { status: 500 }
    );
  }
}