"use client";
import Link from "next/link";
import { BookOpen, GraduationCap, LayoutDashboard, LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/");
  }

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
            <Link href="/dashboard" className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition-colors">
              <LayoutDashboard className="h-4 w-4" /> Tableau de bord
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link href="/profile" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600">
                <User className="h-4 w-4" />
                {user?.firstName}
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors"
              >
                <LogOut className="h-4 w-4" /> Déconnexion
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
