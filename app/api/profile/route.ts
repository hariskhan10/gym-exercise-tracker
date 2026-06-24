import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, image: true, age: true, dateOfBirth: true, currentWeight: true, weightUnit: true },
  });

  return NextResponse.json(user);
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, age, dateOfBirth, currentWeight, weightUnit, image } = body;

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: name ?? undefined,
      age: age ? Number(age) : undefined,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      currentWeight: currentWeight ? Number(currentWeight) : undefined,
      weightUnit: weightUnit ?? undefined,
      image: image ?? undefined,
    },
    select: { id: true, name: true, email: true, image: true, age: true, dateOfBirth: true, currentWeight: true, weightUnit: true },
  });

  return NextResponse.json(user);
}
