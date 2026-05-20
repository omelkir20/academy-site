"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Loader2, Eye, EyeOff } from "lucide-react";
import { authApi } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, loading: authLoading, isAdmin, isInstructor } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      if (isAdmin) router.replace("/admin/dashboard");
      else if (isInstructor) router.replace("/instructor/dashboard");
      else router.replace("/dashboard");
    }
  }, [authLoading, isAuthenticated, isAdmin, isInstructor, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token, user } = await authApi.login(form.email, form.password);
      login(token, user);
      if (user.role === "admin") router.push("/admin/dashboard");
      else if (user.role === "instructor") router.push("/instructor/dashboard");
      else router.push("/dashboard");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Identifiants invalides");
    } finally {
      setLoading(false);
    }
  }

  if (authLoading || isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center animate-pulse">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="w-full max-w-md">
        {/* Logo & header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white mb-5 shadow-lg shadow-blue-200">
            <GraduationCap className="h-9 w-9" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Connexion à LearnHub</h1>
          <p className="text-gray-500 mt-1.5 text-sm">Content de vous revoir !</p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-8 space-y-5">
            {error && (
              <div className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                <span className="mt-0.5 flex-shrink-0 h-4 w-4 rounded-full bg-red-200 flex items-center justify-center text-red-700 font-bold text-xs">!</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Adresse email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="vous@exemple.com"
                  autoComplete="email"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Mot de passe</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-11 text-sm transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition-all shadow-sm hover:shadow-md hover:shadow-blue-100"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {loading ? "Connexion en cours…" : "Se connecter"}
              </button>
            </form>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-gray-400">ou</span>
              </div>
            </div>

            <p className="text-center text-sm text-gray-500">
              Pas encore de compte ?{" "}
              <Link href="/auth/register" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                Créer un compte gratuit
              </Link>
            </p>
          </div>

          {/* Demo credentials footer */}
          <div className="border-t bg-gray-50 px-8 py-4">
            <p className="text-xs font-medium text-gray-400 text-center mb-2">Comptes de démonstration</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { role: "Admin", email: "admin@demo.com" },
                { role: "Instructeur", email: "instructor@demo.com" },
              ].map((d) => (
                <button
                  key={d.email}
                  type="button"
                  onClick={() => setForm({ email: d.email, password: "password123" })}
                  className="rounded-lg border bg-white px-3 py-2 text-left hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <span className="text-xs font-semibold text-gray-700 block">{d.role}</span>
                  <span className="text-xs text-gray-400">{d.email}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
