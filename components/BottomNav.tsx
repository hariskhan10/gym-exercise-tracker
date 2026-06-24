"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", icon: "🏠", label: "Home" },
  { href: "/week", icon: "📅", label: "Week" },
  { href: "/plans", icon: "📋", label: "Plans" },
  { href: "/progress", icon: "📊", label: "Progress" },
  { href: "/profile", icon: "👤", label: "Profile" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 z-50">
      <div className="flex max-w-lg mx-auto">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center py-2 pt-2.5 transition-colors ${
                active ? "text-violet-400" : "text-slate-500"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
      {/* iOS safe area */}
      <div className="h-safe-area-inset-bottom bg-slate-900" />
    </nav>
  );
}
