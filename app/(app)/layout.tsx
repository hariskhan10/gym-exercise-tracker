import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { BottomNav } from "@/components/BottomNav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col max-w-lg mx-auto">
      <main className="flex-1 pb-20">{children}</main>
      <BottomNav />
    </div>
  );
}
