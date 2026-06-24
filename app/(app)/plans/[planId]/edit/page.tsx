import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { PlanEditor } from "./PlanEditor";

export default async function EditPlanPage({ params }: { params: Promise<{ planId: string }> }) {
  const { planId } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const plan = await prisma.workoutPlan.findUnique({
    where: { id: planId },
    include: {
      workoutDays: {
        orderBy: { dayNumber: "asc" },
        include: { exercises: { orderBy: { order: "asc" } } },
      },
    },
  });

  if (!plan) notFound();
  if (plan.userId !== session.user.id) redirect(`/plans/${planId}`);

  return <PlanEditor plan={plan} />;
}
