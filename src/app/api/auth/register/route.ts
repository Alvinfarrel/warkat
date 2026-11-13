import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, signToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, displayName, password } = body;

    if (!username || !displayName || !password) {
      return NextResponse.json(
        { error: "Semua kolom (nama pengguna, nama tampilan, kata sandi) wajib diisi." },
        { status: 400 }
      );
    }

    const cleanUsername = String(username).trim().toLowerCase();
    if (!/^[a-z0-9_]{3,24}$/.test(cleanUsername)) {
      return NextResponse.json(
        {
          error:
            "Nama pengguna hanya boleh terdiri dari 3-24 karakter huruf kecil, angka, dan garis bawah (_).",
        },
        { status: 400 }
      );
    }

    if (String(password).length < 6) {
      return NextResponse.json(
        { error: "Kata sandi minimal 6 karakter." },
        { status: 400 }
      );
    }

    const existing = await db.user.findUnique({
      where: { username: cleanUsername },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Nama pengguna sudah digunakan. Silakan pilih nama lain." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const user = await db.user.create({
      data: {
        username: cleanUsername,
        displayName: String(displayName).trim().slice(0, 40),
        passwordHash,
      },
    });

    const token = await signToken({
      userId: user.id,
      username: user.username,
    });

    const response = NextResponse.json(
      {
        message: "Pendaftaran berhasil.",
        user: {
          id: user.id,
          username: user.username,
          displayName: user.displayName,
        },
      },
      { status: 201 }
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
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal pada server saat mendaftar." },
      { status: 500 }
    );
  }
}
