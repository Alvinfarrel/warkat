import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, signToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Nama pengguna dan kata sandi wajib diisi." },
        { status: 400 }
      );
    }

    const cleanUsername = String(username).trim().toLowerCase();
    const user = await db.user.findUnique({
      where: { username: cleanUsername },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Nama pengguna atau kata sandi tidak sesuai." },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Nama pengguna atau kata sandi tidak sesuai." },
        { status: 401 }
      );
    }

    const token = await signToken({
      userId: user.id,
      username: user.username,
    });

    const response = NextResponse.json(
      {
        message: "Berhasil masuk.",
        user: {
          id: user.id,
          username: user.username,
          displayName: user.displayName,
        },
      },
      { status: 200 }
    );

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server saat mencoba masuk." },
      { status: 500 }
    );
  }
}
