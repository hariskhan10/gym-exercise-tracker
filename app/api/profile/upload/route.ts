import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

const MAX_BYTES = 1_200_000; // ~900KB image after base64 decode

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { dataUrl } = await req.json();

  if (!dataUrl || !dataUrl.startsWith("data:image/")) {
    return NextResponse.json({ error: "Invalid image data" }, { status: 400 });
  }

  // Check size (base64 string length ≈ 4/3 × raw bytes)
  const approxBytes = Math.round((dataUrl.length * 3) / 4);
  if (approxBytes > MAX_BYTES) {
    return NextResponse.json({ error: "Image too large after compression" }, { status: 413 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { image: dataUrl },
  });

  return NextResponse.json({ url: dataUrl });
}
