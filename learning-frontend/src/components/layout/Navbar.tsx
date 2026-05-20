"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen, GraduationCap, LayoutDashboard, LogIn, LogOut,
  User, ShieldCheck, Presentation, ChevronDown, Settings, Menu, X,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
  const { user, logout, isAuthenticated, isAdmin, isInstructor } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const dashboardHref = isAdmin ? "/admin/dashboard" : isInstructor ? "/instructor/dashboard" : "/dashboard";
  const DashIcon = isAdmin ? ShieldCheck : isInstructor ? Presentation : LayoutDashboard;
  const dashLabel = isAdmin ? "Admin" : isInstructor ? "Instructeur" : "Tableau de bord";

  const initials = `${user?.firstName?.charAt(0) ?? ""}${user?.lastName?.charAt(0) ?? ""}`.toUpperCase();

  function handleLogout() {
    logout();
    setDropdownOpen(false);
    router.push("/");
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const navLinks = [
    { href: "/courses", label: "Cours", icon: BookOpen },
    ...(isAuthenticated ? [{ href: dashboardHref, label: dashLabel, icon: DashIcon }] : []),
  ];

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600 flex-shrink-0">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            LearnHub
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1 px-6">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className="h-4 w-4" /> {label}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              /* User dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-3 py-2 hover:border-blue-300 hover:bg-blue-50 transition-all"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">
                    {initials}
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700 max-w-[100px] truncate">
                    {user?.firstName}
                  </span>
                  <ChevronDown className={`h-3.5 w-3.5 text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-gray-100 bg-white shadow-xl overflow-hidden">
                    {/* User info header */}
                    <div className="px-4 py-3 bg-gradient-to-br from-blue-50 to-indigo-50 border-b">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold flex-shrink-0">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{user?.firstName} {user?.lastName}</p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="p-1.5">
                      <Link
                        href="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <User className="h-4 w-4 text-gray-400" /> Mon profil
                      </Link>
                      <Link
                        href={dashboardHref}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <DashIcon className="h-4 w-4 text-gray-400" /> {dashLabel}
                      </Link>
                      <Link
                        href="/courses"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <BookOpen className="h-4 w-4 text-gray-400" /> Mes cours
                      </Link>
                    </div>

                    <div className="border-t p-1.5">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4" /> Déconnexion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="hidden md:block text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors px-3 py-2"
                >
                  Connexion
                </Link>
                <Link
                  href="/auth/register"
                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:block">S'inscrire</span>
                </Link>
              </>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden flex items-center justify-center h-9 w-9 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              {mobileOpen ? <X className="h-5 w-5 text-gray-600" /> : <Menu className="h-5 w-5 text-gray-600" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 z-40 border-b bg-white shadow-lg">
          <nav className="container mx-auto px-4 py-3 space-y-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Icon className="h-4 w-4 text-gray-400" /> {label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link href="/profile" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <User className="h-4 w-4 text-gray-400" /> Mon profil
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" /> Déconnexion
                </button>
              </>
            ) : (
              <Link href="/auth/login" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <LogIn className="h-4 w-4 text-gray-400" /> Connexion
              </Link>
            )}
          </nav>
        </div>
      )}
    </>
  );
}
