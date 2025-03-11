import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    const result = await query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, hashedPassword]
    );

    return NextResponse.json({ user: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
