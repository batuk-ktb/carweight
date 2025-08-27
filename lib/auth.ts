import { SignJWT, jwtVerify, KeyLike } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export interface JwtUser {
  id: number;
  email: string;
}

// Token үүсгэх
export async function signToken(user: JwtUser) {
  return await new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1h")
    .sign(SECRET);
}

// Token verify хийх
export async function verifyToken(token: string): Promise<JwtUser | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);

    // TypeScript-д зөв хөрвүүлэлт
    const user = payload as unknown as JwtUser;

    // Заавал required property байгаа эсэхийг шалгаж болно
    if (!user.id || !user.email) return null;

    return user;
  } catch {
    return null;
  }
}
