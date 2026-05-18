"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "@/components/layout/Sidebar";
import { LayoutDashboard, BookOpen, Plus, BarChart2 } from "lucide-react";

const NAV_ITEMS = [
  { label: "Tableau de bord", href: "/instructor/dashboard", icon: LayoutDashboard },
  { label: "Mes cours",       href: "/instructor/courses",   icon: BookOpen },
  { label: "Nouveau cours",   href: "/instructor/courses/new", icon: Plus },
  { label: "Analytics",       href: "/instructor/analytics", icon: BarChart2 },
];

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isInstructor, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/auth/login");
    if (!loading && user && !isInstructor && !isAdmin) router.replace("/dashboard");
  }, [user, loading, isInstructor, isAdmin, router]);

  if (loading || (!isInstructor && !isAdmin)) return null;

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar items={NAV_ITEMS} title="Espace Instructeur" subtitle={`${user?.firstName} ${user?.lastName}`} />
      <main className="flex-1 bg-gray-50 overflow-auto">{children}</main>
    </div>
  );
}
