"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User, Save, Loader2, GraduationCap, BookOpen, Calendar,
  Shield, Presentation, CheckCircle, Camera, Mail, Clock,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { authApi, coursesApi, type Course } from "@/lib/api";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, levelLabel } from "@/lib/utils";
import Link from "next/link";

type Tab = "profil" | "cours" | "compte";

const ROLE_MAP = {
  admin:      { label: "Administrateur", icon: Shield,       color: "bg-rose-100 text-rose-700 border-rose-200" },
  instructor: { label: "Instructeur",    icon: Presentation, color: "bg-violet-100 text-violet-700 border-violet-200" },
  student:    { label: "Apprenant",      icon: GraduationCap, color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("profil");
  const [form, setForm] = useState({ firstName: "", lastName: "", bio: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [enrollments, setEnrollments] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) { router.push("/auth/login"); return; }
    if (user) {
      setForm({ firstName: user.firstName || "", lastName: user.lastName || "", bio: user.bio || "" });
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user || activeTab !== "cours") return;
    setCoursesLoading(true);
    coursesApi.myEnrollments()
      .then(setEnrollments)
      .catch(() => null)
      .finally(() => setCoursesLoading(false));
  }, [user, activeTab]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setError(""); setSaving(true); setSaved(false);
    try {
      const updated = await authApi.updateProfile({ firstName: form.firstName, lastName: form.lastName, bio: form.bio });
      updateUser(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur lors de la mise à jour");
    } finally {
      setSaving(false);
    }
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  const role = ROLE_MAP[user.role] ?? ROLE_MAP.student;
  const RoleIcon = role.icon;
  const initials = `${user.firstName?.charAt(0) ?? ""}${user.lastName?.charAt(0) ?? ""}`.toUpperCase();
  const joinedDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString("fr-FR", { year: "numeric", month: "long" }) : null;

  const TABS: { id: Tab; label: string; icon: typeof User }[] = [
    { id: "profil",  label: "Mon profil",  icon: User },
    { id: "cours",   label: "Mes cours",   icon: BookOpen },
    { id: "compte",  label: "Compte",      icon: Shield },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-[80px]" />
        <div className="container mx-auto px-4 py-10 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
            <div className="relative flex-shrink-0">
              <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-emerald-900/50 border-2 border-white/10">
                {initials}
              </div>
              <div className="absolute -bottom-2 -right-2 h-7 w-7 rounded-xl bg-white flex items-center justify-center shadow-lg cursor-pointer hover:bg-emerald-50 transition-colors">
                <Camera className="h-3.5 w-3.5 text-emerald-600" />
              </div>
            </div>

            <div className="text-center sm:text-left flex-1 pb-1">
              <h1 className="text-2xl font-black text-white">
                {user.firstName} {user.lastName}
              </h1>
              <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 mt-2">
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${role.color}`}>
                  <RoleIcon className="h-3.5 w-3.5" /> {role.label}
                </span>
                <span className="text-gray-500 text-sm">{user.email}</span>
              </div>
              {user.bio && <p className="mt-2 text-sm text-gray-400 italic max-w-lg">"{user.bio}"</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-100 sticky top-16 z-10">
        <div className="container mx-auto px-4">
          <nav className="flex gap-0">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold border-b-2 transition-all ${
                    activeTab === tab.id
                      ? "border-emerald-500 text-emerald-700"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon className="h-4 w-4" /> {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">

        {activeTab === "profil" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                <User className="h-5 w-5 text-emerald-600" /> Modifier mon profil
              </h2>

              {error && (
                <div className="mb-5 flex items-start gap-3 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                  <span className="mt-0.5 flex-shrink-0 h-4 w-4 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-xs">!</span>
                  {error}
                </div>
              )}
              {saved && (
                <div className="mb-5 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
                  <CheckCircle className="h-4 w-4" /> Profil mis à jour avec succès !
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Prénom</label>
                    <input type="text" value={form.firstName}
                      onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-3 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Nom</label>
                    <input type="text" value={form.lastName}
                      onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-3 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Email <span className="text-gray-400 font-normal">(non modifiable)</span></label>
                  <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-3">
                    <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-500">{user.email}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Biographie</label>
                  <textarea rows={4} value={form.bio}
                    onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                    placeholder="Parlez-nous de vous, de vos compétences et de vos objectifs d'apprentissage..."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-3 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 resize-none"
                  />
                  <p className="text-xs text-gray-400">{form.bio.length}/300 caractères</p>
                </div>

                <div className="flex items-center justify-end pt-2 border-t border-gray-50">
                  <button type="submit" disabled={saving}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-2.5 text-sm font-bold text-white hover:from-emerald-600 hover:to-teal-600 disabled:opacity-60 transition-all shadow-md shadow-emerald-200"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {saving ? "Enregistrement…" : "Enregistrer"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === "cours" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                Mes formations ({enrollments.length})
              </h2>
              <Link href="/courses" className="text-sm text-emerald-600 hover:underline font-semibold">
                Explorer le catalogue →
              </Link>
            </div>

            {coursesLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
              </div>
            ) : enrollments.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-200" />
                <h3 className="text-gray-600 font-semibold mb-1">Aucun cours suivi</h3>
                <p className="text-sm text-gray-400 mb-5">Commencez votre apprentissage dès aujourd'hui</p>
                <Link href="/courses"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-bold text-white hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md shadow-emerald-200"
                >
                  Découvrir les cours
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {enrollments.map((course) => (
                  <Link key={course.id} href={`/courses/${course.id}`}>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50 transition-all group">
                      <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-100">
                        <BookOpen className="h-7 w-7 text-white/80" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                          {course.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant="default">{levelLabel(course.level)}</Badge>
                          <span className="text-xs text-gray-400">{course.category?.name}</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className={`text-sm font-bold ${course.is_free ? "text-emerald-600" : "text-gray-900"}`}>
                          {formatPrice(Number(course.price), course.is_free)}
                        </span>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" /> Inscrit
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "compte" && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-600" /> Informations du compte
              </h2>
              <dl className="divide-y divide-gray-50">
                {[
                  { label: "Nom complet",    value: `${user.firstName} ${user.lastName}` },
                  { label: "Email",          value: user.email },
                  { label: "Rôle",           value: role.label },
                  { label: "Membre depuis",  value: joinedDate ?? "—" },
                  { label: "Statut",         value: user.isActive !== false ? "Actif" : "Inactif" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-3">
                    <dt className="text-sm text-gray-500 font-medium">{label}</dt>
                    <dd className="text-sm text-gray-900 font-semibold">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Résumé</h2>
              <p className="text-sm text-gray-500 mb-5">Votre activité sur la plateforme</p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: BookOpen,   label: "Cours inscrits",  value: "—", gradient: "from-emerald-400 to-teal-500" },
                  { icon: CheckCircle, label: "Complétés",      value: "0", gradient: "from-sky-400 to-cyan-500" },
                  { icon: Clock,      label: "Heures d'étude",  value: "—", gradient: "from-violet-400 to-purple-500" },
                ].map((s) => (
                  <div key={s.label} className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4 text-center">
                    <div className={`h-10 w-10 mx-auto mb-2.5 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-sm`}>
                      <s.icon className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-2xl font-black text-gray-900">{s.value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-red-50 rounded-2xl border border-red-100 p-6">
              <h2 className="text-base font-bold text-red-700 mb-1">Zone de danger</h2>
              <p className="text-sm text-red-400 mb-4">Les actions ci-dessous sont irréversibles.</p>
              <button disabled
                className="rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-400 opacity-50 cursor-not-allowed"
                title="Fonctionnalité bientôt disponible"
              >
                Supprimer mon compte
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
