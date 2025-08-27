import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/mongo";
import { User } from "@/models/Users";

export async function POST(req: Request) {
  await dbConnect();
  const { email, password } = await req.json();
  const hashed = await bcrypt.hash(password, 10);

  try {
    await User.create({ email, password: hashed });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Email already exists" }, { status: 400 });
  }
}
