import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const cleanUsername = String(username).toLowerCase();

    const user = await db.user.findUnique({
      where: { username: cleanUsername },
      select: {
        id: true,
        username: true,
        displayName: true,
        bio: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Penerima surat tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Fetch user error:", error);
    return NextResponse.json(
      { error: "Gagal memuat informasi penerima surat." },
      { status: 500 }
    );
  }
}
