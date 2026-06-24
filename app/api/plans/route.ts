import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [defaultPlans, myPlans, user] = await Promise.all([
    prisma.workoutPlan.findMany({
      where: { isDefault: true },
      include: { workoutDays: { include: { exercises: true }, orderBy: { dayNumber: "asc" } } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.workoutPlan.findMany({
      where: { userId: session.user.id, isDefault: false },
      include: { workoutDays: { include: { exercises: true }, orderBy: { dayNumber: "asc" } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findUnique({ where: { id: session.user.id }, select: { activePlanId: true } }),
  ]);

  return NextResponse.json({ defaultPlans, myPlans, activePlanId: user?.activePlanId });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, description } = await req.json();
  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });

  const plan = await prisma.workoutPlan.create({
    data: { name, description, userId: session.user.id, isDefault: false },
  });

  return NextResponse.json(plan);
}
