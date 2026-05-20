"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "@/components/layout/Sidebar";
import { LayoutDashboard, Users, BookOpen, BarChart2, Settings } from "lucide-react";

const NAV_ITEMS = [
  { label: "Tableau de bord", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Utilisateurs",    href: "/admin/users",     icon: Users },
  { label: "Cours",           href: "/admin/courses",   icon: BookOpen },
  { label: "Analytics",       href: "/admin/analytics", icon: BarChart2 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.replace(user ? "/" : "/auth/login");
    }
  }, [user, loading, isAdmin, router]);

  if (loading || !isAdmin) return null;

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar items={NAV_ITEMS} title="Administration" subtitle={`${user?.firstName} ${user?.lastName}`} />
      <main className="flex-1 bg-gray-50 overflow-auto">
        {children}
      </main>
    </div>
  );
}
