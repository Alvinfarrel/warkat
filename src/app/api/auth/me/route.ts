import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      username: true,
      displayName: true,
      bio: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ user: user || null }, { status: 200 });
}
