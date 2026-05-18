"use client";
import Link from "next/link";
import { BookOpen, GraduationCap, LayoutDashboard, LogIn, LogOut, User, ShieldCheck, Presentation } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { user, logout, isAuthenticated, isAdmin, isInstructor } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/");
  }

  const dashboardHref = isAdmin ? "/admin/dashboard" : isInstructor ? "/instructor/dashboard" : "/dashboard";
  const dashboardIcon = isAdmin ? ShieldCheck : isInstructor ? Presentation : LayoutDashboard;
  const DashIcon = dashboardIcon;

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
          <GraduationCap className="h-6 w-6" />
          LearnHub
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/courses" className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition-colors">
            <BookOpen className="h-4 w-4" /> Cours
          </Link>
          {isAuthenticated && (
            <Link href={dashboardHref} className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition-colors">
              <DashIcon className="h-4 w-4" />
              {isAdmin ? "Admin" : isInstructor ? "Instructeur" : "Tableau de bord"}
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link href="/profile" className="flex items-center gap-2 text-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold text-xs">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </div>
                <span className="text-gray-700 hidden md:block">{user?.firstName}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden md:block">Déconnexion</span>
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Connexion
              </Link>
              <Link
                href="/auth/register"
                className="flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                <LogIn className="h-4 w-4" /> Inscription
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
