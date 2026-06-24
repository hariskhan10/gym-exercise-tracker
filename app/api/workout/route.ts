import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const plan = await prisma.workoutPlan.findFirst({
    where: { isDefault: true },
    include: {
      workoutDays: {
        orderBy: { dayNumber: "asc" },
        include: {
          exercises: {
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });

  return NextResponse.json(plan);
}
