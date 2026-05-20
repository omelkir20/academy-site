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

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const navLinks = [
    { href: "/courses", label: "Cours", icon: BookOpen },
    ...(isAuthenticated ? [{ href: dashboardHref, label: dashLabel, icon: DashIcon }] : []),
  ];

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-gray-100/80 bg-white/90 backdrop-blur-xl shadow-sm shadow-gray-100/50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 gap-4">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-xl flex-shrink-0 group">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-200 group-hover:shadow-emerald-300 transition-shadow">
              <GraduationCap className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              LearnHub
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-0.5 flex-1 px-6">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-emerald-50 text-emerald-700 shadow-sm shadow-emerald-100"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? "text-emerald-600" : ""}`} /> {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-3 py-2 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all duration-200 shadow-sm"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 text-white text-xs font-bold shadow-sm">
                    {initials}
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700 max-w-[100px] truncate">
                    {user?.firstName}
                  </span>
                  <ChevronDown className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-gray-100 bg-white shadow-2xl shadow-gray-200/80 overflow-hidden">
                    <div className="px-4 py-3.5 bg-gradient-to-br from-emerald-50 to-teal-50 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white text-sm font-bold flex-shrink-0 shadow-md shadow-emerald-200">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{user?.firstName} {user?.lastName}</p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                      </div>
                    </div>

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

                    <div className="border-t border-gray-100 p-1.5">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
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
                  className="hidden md:block text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors px-3 py-2"
                >
                  Connexion
                </Link>
                <Link
                  href="/auth/register"
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-sm font-semibold text-white hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md shadow-emerald-200 hover:shadow-emerald-300"
                >
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:block">S'inscrire</span>
                </Link>
              </>
            )}

            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden flex items-center justify-center h-9 w-9 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              {mobileOpen ? <X className="h-5 w-5 text-gray-600" /> : <Menu className="h-5 w-5 text-gray-600" />}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 z-40 border-b border-gray-100 bg-white/95 backdrop-blur-xl shadow-xl">
          <nav className="container mx-auto px-4 py-3 space-y-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
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
                  className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
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
