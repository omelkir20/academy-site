"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, BookOpen, Plus, BarChart3, Presentation
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar, type NavItem } from "@/components/layout/Sidebar";

const NAV_ITEMS: NavItem[] = [
  { label: "Tableau de bord", href: "/instructor/dashboard", icon: LayoutDashboard },
  { label: "Mes cours",       href: "/instructor/courses",   icon: BookOpen },
  { label: "Nouveau cours",   href: "/instructor/courses/new", icon: Plus },
  { label: "Analytiques",     href: "/instructor/analytics", icon: BarChart3 },
];

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isInstructor } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isInstructor)) router.replace("/auth/login");
  }, [user, loading, isInstructor, router]);

  if (loading || !user || !isInstructor) return null;

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar items={NAV_ITEMS} title="Espace Instructeur" subtitle={`${user.firstName} ${user.lastName}`} />
      <main className="flex-1 bg-gray-50 overflow-auto">{children}</main>
    </div>
  );
}
