import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const exerciseId = formData.get("exerciseId") as string;

  if (!file || !exerciseId) {
    return NextResponse.json({ error: "Missing file or exerciseId" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = file.name.split(".").pop();
  const filename = `exercise-${exerciseId}-${Date.now()}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "exercises");

  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), buffer);

  const mediaUrl = `/uploads/exercises/${filename}`;
  await prisma.exercise.update({ where: { id: exerciseId }, data: { mediaUrl } });

  return NextResponse.json({ mediaUrl });
}
