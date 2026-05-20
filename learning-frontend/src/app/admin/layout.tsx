"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, BookOpen, Users, BarChart3, Shield,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar, type NavItem } from "@/components/layout/Sidebar";

const NAV_ITEMS: NavItem[] = [
  { label: "Tableau de bord", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Cours",           href: "/admin/courses",   icon: BookOpen },
  { label: "Utilisateurs",    href: "/admin/users",     icon: Users },
  { label: "Analytiques",     href: "/admin/analytics", icon: BarChart3 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.replace("/auth/login");
  }, [user, loading, isAdmin, router]);

  if (loading || !user || !isAdmin) return null;

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar items={NAV_ITEMS} title="Administration" subtitle="LearnHub Admin" />
      <main className="flex-1 bg-gray-50 overflow-auto">{children}</main>
    </div>
  );
}
