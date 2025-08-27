import { NextResponse } from "next/server";

export async function POST() {
  console.log('logout called');
  const res = NextResponse.json({ message: "Logged out" });
res.cookies.set({
  name: "token",
  value: "",
  httpOnly: true,
  path: "/",            // login үед тавьсан path-тэй таарах ёстой
  maxAge: 0,            // эсвэл expires: new Date(0)
});
  // Token cookie-г устгах

  return res;
}
