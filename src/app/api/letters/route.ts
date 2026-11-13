import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { put } from "@vercel/blob";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json(
        { error: "Akses ditolak. Silakan masuk terlebih dahulu." },
        { status: 401 }
      );
    }

    const letters = await db.letter.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
      include: {
        attachments: true,
      },
    });

    return NextResponse.json({ letters });
  } catch (error) {
    console.error("Get letters error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil koleksi surat." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const recipientUsername = formData.get("username") as string;
    const senderName = formData.get("senderName") as string | null;
    const content = formData.get("content") as string;
    const presetStyle = (formData.get("presetStyle") as string) || "vintage";
    const imageFile = formData.get("image") as File | null;
    const audioFile = formData.get("audio") as File | null;
    const audioDurationRaw = formData.get("audioDuration") as string | null;

    if (!recipientUsername) {
      return NextResponse.json(
        { error: "Tujuan penerima surat tidak valid." },
        { status: 400 }
      );
    }

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "Pesan surat tidak boleh kosong." },
        { status: 400 }
      );
    }

    if (content.trim().length > 5000) {
      return NextResponse.json(
        { error: "Pesan surat maksimal 5000 karakter." },
        { status: 400 }
      );
    }

    const recipient = await db.user.findUnique({
      where: { username: recipientUsername.toLowerCase().trim() },
    });

    if (!recipient) {
      return NextResponse.json(
        { error: "Penerima surat tidak ditemukan." },
        { status: 404 }
      );
    }

    const hasVercelBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    if (!hasVercelBlob) {
      await fs.mkdir(uploadsDir, { recursive: true });
    }

    const attachmentsData: Array<{
      type: "IMAGE" | "AUDIO";
      fileUrl: string;
      fileName: string;
      fileSize: number;
      duration?: number;
    }> = [];

    // Handle image attachment
    if (imageFile && imageFile.size > 0) {
      if (imageFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Ukuran foto lampiran maksimal 5 MB." },
          { status: 400 }
        );
      }

      const mime = imageFile.type.toLowerCase();
      const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      if (!allowedMimes.includes(mime)) {
        return NextResponse.json(
          { error: "Format gambar harus JPG, PNG, WebP, atau GIF." },
          { status: 400 }
        );
      }

      const ext = path.extname(imageFile.name) || ".jpg";
      const filename = `img_${crypto.randomUUID()}${ext}`;
      let finalFileUrl = "";

      if (hasVercelBlob) {
        const blob = await put(`uploads/${filename}`, imageFile, {
          access: "public",
        });
        finalFileUrl = blob.url;
      } else {
        const filepath = path.join(uploadsDir, filename);
        const arrayBuffer = await imageFile.arrayBuffer();
        await fs.writeFile(filepath, Buffer.from(arrayBuffer));
        finalFileUrl = `/uploads/${filename}`;
      }

      attachmentsData.push({
        type: "IMAGE",
        fileUrl: finalFileUrl,
        fileName: imageFile.name.slice(0, 80),
        fileSize: imageFile.size,
      });
    }

    // Handle audio attachment
    if (audioFile && audioFile.size > 0) {
      if (audioFile.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Ukuran rekaman audio maksimal 10 MB." },
          { status: 400 }
        );
      }

      const mime = audioFile.type.toLowerCase();
      const isAudio =
        mime.startsWith("audio/") ||
        mime.includes("webm") ||
        mime.includes("ogg") ||
        mime.includes("mp4") ||
        mime.includes("m4a");

      if (!isAudio) {
        return NextResponse.json(
          { error: "Format file audio tidak valid." },
          { status: 400 }
        );
      }

      let ext = path.extname(audioFile.name);
      if (!ext) {
        if (mime.includes("webm")) ext = ".webm";
        else if (mime.includes("ogg")) ext = ".ogg";
        else if (mime.includes("mp4") || mime.includes("m4a")) ext = ".m4a";
        else ext = ".mp3";
      }

      const filename = `audio_${crypto.randomUUID()}${ext}`;
      let finalAudioUrl = "";

      if (hasVercelBlob) {
        const blob = await put(`uploads/${filename}`, audioFile, {
          access: "public",
        });
        finalAudioUrl = blob.url;
      } else {
        const filepath = path.join(uploadsDir, filename);
        const arrayBuffer = await audioFile.arrayBuffer();
        await fs.writeFile(filepath, Buffer.from(arrayBuffer));
        finalAudioUrl = `/uploads/${filename}`;
      }

      const parsedDuration = audioDurationRaw ? parseInt(audioDurationRaw, 10) : undefined;

      attachmentsData.push({
        type: "AUDIO",
        fileUrl: finalAudioUrl,
        fileName: audioFile.name.slice(0, 80) || "Pesan Suara",
        fileSize: audioFile.size,
        duration: isNaN(parsedDuration as number) ? undefined : parsedDuration,
      });
    }

    const letter = await db.letter.create({
      data: {
        userId: recipient.id,
        senderName: senderName?.trim() ? senderName.trim().slice(0, 60) : "Teman Rahasia",
        content: content.trim(),
        presetStyle: presetStyle || "vintage",
        attachments: {
          create: attachmentsData,
        },
      },
      include: {
        attachments: true,
      },
    });

    return NextResponse.json(
      {
        message: "Surat berhasil dikirim dan disegel rapi.",
        letterId: letter.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create letter error:", error);
    return NextResponse.json(
      { error: "Terjadi gangguan saat memproses pengiriman surat." },
      { status: 500 }
    );
  }
}
