import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const exerciseId = formData.get("exerciseId") as string;

  if (!file || !exerciseId) {
    return NextResponse.json({ error: "Missing file or exerciseId" }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 5 MB)" }, { status: 413 });
  }

  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");
  const mediaUrl = `data:${file.type};base64,${base64}`;

  await prisma.exercise.update({ where: { id: exerciseId }, data: { mediaUrl } });

  return NextResponse.json({ mediaUrl });
}
