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
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center animate-pulse shadow-lg shadow-emerald-200">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
        </div>
      </div>
    );
  }

  const passwordStrength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 8 ? 2 : form.password.length < 12 ? 3 : 4;
  const strengthColors = ["", "bg-red-400", "bg-amber-400", "bg-emerald-400", "bg-emerald-500"];
  const strengthLabels = ["", "Trop court", "Faible", "Bon", "Fort"];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-50 via-emerald-50/30 to-teal-50/20">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white mb-5 shadow-xl shadow-emerald-200">
            <GraduationCap className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">Créer votre compte</h1>
          <p className="text-gray-500 mt-1.5 text-sm">Rejoignez des milliers d'apprenants</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50 p-8 space-y-5">
          {error && (
            <div className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
              <span className="mt-0.5 flex-shrink-0 h-4 w-4 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-xs">!</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Prénom</label>
                <input
                  type="text" required value={form.firstName}
                  onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                  placeholder="Jean" autoComplete="given-name"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-3 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Nom</label>
                <input
                  type="text" required value={form.lastName}
                  onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                  placeholder="Dupont" autoComplete="family-name"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-3 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Adresse email</label>
              <input
                type="email" required value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="vous@exemple.com" autoComplete="email"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-3 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Mot de passe <span className="text-gray-400 font-normal">(min. 8 caractères)</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} required minLength={8} value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••" autoComplete="new-password"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-3 pr-11 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                />
                <button type="button" onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors" tabIndex={-1}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {form.password && (
                <div className="space-y-1.5">
                  <div className="flex gap-1">
                    {[1,2,3,4].map((i) => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= passwordStrength ? strengthColors[passwordStrength] : "bg-gray-100"}`} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">{strengthLabels[passwordStrength]}</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Je souhaite</label>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map((r) => {
                  const Icon = r.icon;
                  const active = form.role === r.value;
                  return (
                    <button key={r.value} type="button" onClick={() => setForm((f) => ({ ...f, role: r.value }))}
                      className={`rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                        active ? "border-emerald-400 bg-emerald-50 shadow-md shadow-emerald-100" : "border-gray-200 bg-gray-50/80 hover:border-gray-300 hover:bg-white"
                      }`}
                    >
                      <Icon className={`h-5 w-5 mb-2 ${active ? "text-emerald-600" : "text-gray-400"}`} />
                      <span className={`text-sm font-bold block ${active ? "text-emerald-700" : "text-gray-700"}`}>{r.label}</span>
                      <span className="text-xs text-gray-400 leading-tight">{r.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3.5 text-sm font-bold text-white hover:from-emerald-600 hover:to-teal-600 disabled:opacity-60 transition-all shadow-lg shadow-emerald-200 hover:shadow-emerald-300 hover:-translate-y-0.5"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {loading ? "Création du compte…" : "Créer mon compte"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Déjà inscrit ?{" "}
            <Link href="/auth/login" className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
