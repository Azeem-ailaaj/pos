import { db } from "@/db";
import { locations } from "@/db/schema/location";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await req.json();
    const location = await db.insert(locations).values({
      ...data,
      user_id: userId,
    }).returning();

    return NextResponse.json(location[0]);
  } catch (error) {
    console.error('[LOCATIONS_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const locations = await db.location.findMany();
    return NextResponse.json(locations);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch locations" },
      { status: 500 }
    );
  }
}

{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}