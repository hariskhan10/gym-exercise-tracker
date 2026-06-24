import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");

  const where = {
    userId: session.user.id,
    ...(date ? { date } : {}),
  };

  const logs = await prisma.exerciseLog.findMany({ where });
  return NextResponse.json(logs);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { exerciseId, date, completed, actualSets, actualReps, weight, notes } = body;

  const log = await prisma.exerciseLog.upsert({
    where: { userId_exerciseId_date: { userId: session.user.id, exerciseId, date } },
    create: { userId: session.user.id, exerciseId, date, completed, actualSets, actualReps, weight, notes },
    update: { completed, actualSets, actualReps, weight, notes },
  });

  return NextResponse.json(log);
}
