import { prisma } from "@/lib/db";

export async function getActivePlan(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { activePlanId: true },
  });

  // Use user's assigned plan, fall back to system default
  const planId = user?.activePlanId ?? undefined;

  return prisma.workoutPlan.findFirst({
    where: planId ? { id: planId } : { isDefault: true },
    include: {
      workoutDays: {
        orderBy: { dayNumber: "asc" },
        include: { exercises: { orderBy: { order: "asc" } } },
      },
    },
  });
}
