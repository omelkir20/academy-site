"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Loader2, Eye, EyeOff, BookOpen, Presentation } from "lucide-react";
import { authApi } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

const ROLES = [
  { value: "student",    label: "Apprenant",    desc: "Je veux apprendre et suivre des cours",  icon: BookOpen },
  { value: "instructor", label: "Instructeur",   desc: "Je veux créer et partager des cours",    icon: Presentation },
];

export default function RegisterPage() {
  const router = useRouter();
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const [form, setForm] = useState({ email: "", password: "", firstName: "", lastName: "", role: "student" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated) router.replace("/dashboard");
  }, [authLoading, isAuthenticated, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password.length < 8) { setError("Le mot de passe doit contenir au moins 8 caractères."); return; }
    setError("");
    setLoading(true);
    try {
      const { token, user } = await authApi.register(form);
      login(token, user);
      if (user.role === "instructor") router.push("/instructor/dashboard");
      else router.push("/dashboard");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur lors de l'inscription");
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
      <div className="w-full max-w-lg">
        {/* Logo & header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white mb-5 shadow-lg shadow-blue-200">
            <GraduationCap className="h-9 w-9" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Créer votre compte</h1>
          <p className="text-gray-500 mt-1.5 text-sm">Rejoignez des milliers d'apprenants</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-5">
          {error && (
            <div className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              <span className="mt-0.5 flex-shrink-0 h-4 w-4 rounded-full bg-red-200 flex items-center justify-center text-red-700 font-bold text-xs">!</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Prénom</label>
                <input
                  type="text"
                  required
                  value={form.firstName}
                  onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                  placeholder="Jean"
                  autoComplete="given-name"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Nom</label>
                <input
                  type="text"
                  required
                  value={form.lastName}
                  onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                  placeholder="Dupont"
                  autoComplete="family-name"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Email */}
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

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Mot de passe <span className="text-gray-400 font-normal">(min. 8 caractères)</span></label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  autoComplete="new-password"
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
              {form.password && (
                <div className="flex gap-1 mt-1">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                      form.password.length >= (i + 1) * 2
                        ? form.password.length >= 12 ? "bg-green-400" : form.password.length >= 8 ? "bg-yellow-400" : "bg-red-400"
                        : "bg-gray-200"
                    }`} />
                  ))}
                </div>
              )}
            </div>

            {/* Role selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Je souhaite</label>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map((r) => {
                  const Icon = r.icon;
                  const active = form.role === r.value;
                  return (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, role: r.value }))}
                      className={`rounded-xl border-2 p-4 text-left transition-all ${
                        active
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white"
                      }`}
                    >
                      <Icon className={`h-5 w-5 mb-1.5 ${active ? "text-blue-600" : "text-gray-400"}`} />
                      <span className={`text-sm font-semibold block ${active ? "text-blue-700" : "text-gray-700"}`}>{r.label}</span>
                      <span className="text-xs text-gray-400 leading-tight">{r.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition-all shadow-sm hover:shadow-md hover:shadow-blue-100"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {loading ? "Création du compte…" : "Créer mon compte"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Déjà inscrit ?{" "}
            <Link href="/auth/login" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
