import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/lib/mongo";
import { User } from "@/models/Users";

const SECRET = process.env.JWT_SECRET || "dev_secret";

export async function POST(req: Request) {
  await dbConnect();
  const { email, password } = await req.json();
  const user = await User.findOne({ email });
  if (!user) return NextResponse.json({ error: "No user" }, { status: 400 });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return NextResponse.json({ error: "Wrong password" }, { status: 400 });

  const token = jwt.sign({ id: user._id, email }, SECRET, { expiresIn: "1h" });
  const res = NextResponse.json({ success: true });
  res.cookies.set("token", token, { httpOnly: true });
  return res;
}