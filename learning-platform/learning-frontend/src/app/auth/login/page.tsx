"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Loader2 } from "lucide-react";
import { authApi } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, loading: authLoading, isAdmin, isInstructor } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  if (authLoading) return null;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white mb-4">
            <GraduationCap className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Connexion à LearnHub</h1>
          <p className="text-gray-500 mt-1">Content de vous revoir !</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border shadow-sm p-8 space-y-5">
          {error && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">{error}</div>}

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input type="email" required value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="vous@exemple.com"
              className="w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Mot de passe</label>
            <input type="password" required value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              placeholder="••••••••"
              className="w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Se connecter
          </button>

          <p className="text-center text-sm text-gray-500">
            Pas encore de compte ?{" "}
            <Link href="/auth/register" className="text-blue-600 hover:underline font-medium">S'inscrire</Link>
          </p>

          <div className="border-t pt-4 text-xs text-gray-400 text-center space-y-1">
            <p>Comptes de démonstration :</p>
            <p>admin@demo.com / password123 · instructor@demo.com / password123</p>
          </div>
        </form>
      </div>
    </div>
  );
}
