import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Akses tidak sah." }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const letter = await db.letter.findUnique({
      where: { id },
    });

    if (!letter || letter.userId !== session.userId) {
      return NextResponse.json(
        { error: "Surat tidak ditemukan atau bukan milik Anda." },
        { status: 404 }
      );
    }

    const updateData: { isRead?: boolean; isFavorite?: boolean } = {};
    if (typeof body.isRead === "boolean") updateData.isRead = body.isRead;
    if (typeof body.isFavorite === "boolean") updateData.isFavorite = body.isFavorite;

    const updated = await db.letter.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ letter: updated });
  } catch (error) {
    console.error("Patch letter error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui status surat." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Akses tidak sah." }, { status: 401 });
    }

    const { id } = await params;

    const letter = await db.letter.findUnique({
      where: { id },
      include: { attachments: true },
    });

    if (!letter || letter.userId !== session.userId) {
      return NextResponse.json(
        { error: "Surat tidak ditemukan atau bukan milik Anda." },
        { status: 404 }
      );
    }

    // Attempt to remove attachments from disk
    for (const att of letter.attachments) {
      try {
        const localPath = path.join(process.cwd(), "public", att.fileUrl);
        await fs.unlink(localPath);
      } catch {
        // Ignore if already deleted
      }
    }

    await db.letter.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Surat berhasil dihapus." });
  } catch (error) {
    console.error("Delete letter error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus surat." },
      { status: 500 }
    );
  }
}
