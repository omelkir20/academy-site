import Link from "next/link";
import { ArrowRight, BookOpen, Brain, GraduationCap, Zap, Shield, Users, Star, CheckCircle, Play, TrendingUp, Sparkles } from "lucide-react";

const STATS = [
  { value: "12 000+", label: "Apprenants actifs" },
  { value: "150+",    label: "Cours disponibles" },
  { value: "4.8/5",   label: "Note moyenne" },
  { value: "98%",     label: "Taux de satisfaction" },
];

const FEATURES = [
  {
    icon: BookOpen,
    title: "Catalogue varié",
    desc: "Plus de 150 cours gratuits et payants en DevOps, Cloud, IA, Python et Cybersécurité.",
    color: "from-emerald-400 to-teal-500",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
  },
  {
    icon: Brain,
    title: "Tuteur IA intégré",
    desc: "Posez vos questions à tout moment. Notre IA répond en contexte avec vos cours.",
    color: "from-violet-400 to-purple-500",
    bg: "bg-violet-50",
    text: "text-violet-600",
  },
  {
    icon: TrendingUp,
    title: "Suivi de progression",
    desc: "Visualisez votre avancement, reprenez là où vous en étiez et mesurez vos progrès.",
    color: "from-sky-400 to-cyan-500",
    bg: "bg-sky-50",
    text: "text-sky-600",
  },
  {
    icon: GraduationCap,
    title: "Certifications",
    desc: "Validez vos compétences avec des certificats reconnus et partagez-les sur LinkedIn.",
    color: "from-amber-400 to-orange-500",
    bg: "bg-amber-50",
    text: "text-amber-600",
  },
  {
    icon: Shield,
    title: "Contenu de qualité",
    desc: "Chaque cours est créé par des experts certifiés avec des années d'expérience en entreprise.",
    color: "from-rose-400 to-pink-500",
    bg: "bg-rose-50",
    text: "text-rose-600",
  },
  {
    icon: Zap,
    title: "Accès immédiat",
    desc: "Commencez à apprendre en quelques secondes. Aucune configuration, 100% dans le navigateur.",
    color: "from-indigo-400 to-blue-500",
    bg: "bg-indigo-50",
    text: "text-indigo-600",
  },
];

const CATEGORIES = [
  { name: "DevOps & CI/CD",            icon: "⚙️", count: 28, gradient: "from-sky-500 to-cyan-600", ring: "ring-sky-100" },
  { name: "Cloud (AWS, GCP, Azure)",   icon: "☁️", count: 34, gradient: "from-blue-500 to-indigo-600", ring: "ring-blue-100" },
  { name: "Intelligence Artificielle", icon: "🤖", count: 21, gradient: "from-violet-500 to-purple-600", ring: "ring-violet-100" },
  { name: "Python & Data Science",     icon: "🐍", count: 19, gradient: "from-emerald-500 to-teal-600", ring: "ring-emerald-100" },
  { name: "Cybersécurité",             icon: "🛡️", count: 16, gradient: "from-rose-500 to-red-600", ring: "ring-rose-100" },
  { name: "Développement Web",         icon: "🌐", count: 32, gradient: "from-amber-500 to-orange-600", ring: "ring-amber-100" },
];

const TESTIMONIALS = [
  {
    name: "Marie L.",
    role: "DevOps Engineer",
    avatar: "ML",
    gradient: "from-emerald-400 to-teal-500",
    text: "LearnHub m'a permis de décrocher ma certification AWS en 3 mois. Le tuteur IA est bluffant, il répond exactement à mes questions de cours.",
    stars: 5,
  },
  {
    name: "Thomas B.",
    role: "Data Scientist",
    avatar: "TB",
    gradient: "from-violet-400 to-purple-500",
    text: "Les cours Python et ML sont excellents. Le contenu est à jour, pratique et bien structuré. Je recommande à tous mes collègues.",
    stars: 5,
  },
  {
    name: "Sophie M.",
    role: "Pentester",
    avatar: "SM",
    gradient: "from-sky-400 to-cyan-500",
    text: "La section cybersécurité est de très haute qualité. Les labs pratiques m'ont préparé à l'OSCP. Meilleure plateforme francophone.",
    stars: 5,
  },
];

export default function HomePage() {
  return (
    <div className="overflow-hidden">

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-gray-950 via-gray-900 to-slate-900 text-white overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute inset-0 pattern-dots opacity-30" />
        <div className="absolute inset-0 pattern-mesh" />
        <div className="absolute top-1/4 right-0 h-[500px] w-[500px] rounded-full bg-emerald-500/8 blur-[100px] animate-float-slow" />
        <div className="absolute bottom-1/4 left-0 h-[400px] w-[400px] rounded-full bg-violet-500/10 blur-[80px] animate-float" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-teal-500/5 blur-[120px]" />

        <div className="relative container mx-auto px-4 py-28 md:py-36 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium mb-8 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Tuteur IA disponible 24h/24 — Répondez à vos questions en temps réel
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-[1.05] tracking-tight text-shadow">
            Apprenez à votre rythme,
            <br />
            <span className="gradient-text">
              guidé par l'IA
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Des formations de qualité sur le DevOps, le Cloud et l'IA — gratuites ou abordables — avec un assistant IA qui répond à toutes vos questions en contexte.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold px-8 py-4 hover:from-emerald-400 hover:to-teal-400 transition-all shadow-xl shadow-emerald-900/50 hover:shadow-emerald-800/60 hover:-translate-y-0.5"
            >
              Explorer les cours <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2.5 rounded-2xl border border-white/15 bg-white/5 text-white font-bold px-8 py-4 hover:bg-white/10 hover:border-white/25 transition-all backdrop-blur-sm"
            >
              <Play className="h-4 w-4 fill-current" />
              Commencer gratuitement
            </Link>
          </div>

          <div className="mt-14 flex items-center justify-center gap-3">
            <div className="flex -space-x-2">
              {["from-emerald-400 to-teal-500", "from-violet-400 to-purple-500", "from-sky-400 to-cyan-500", "from-amber-400 to-orange-500", "from-rose-400 to-pink-500"].map((g, i) => (
                <div key={i} className={`h-9 w-9 rounded-full bg-gradient-to-br ${g} border-2 border-gray-900 flex items-center justify-center text-white text-xs font-bold shadow-lg`}>
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <p className="text-gray-400 text-sm ml-1">
              <strong className="text-white">12 000+</strong> apprenants nous font confiance
            </p>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s) => (
              <div key={s.label} className="text-center group">
                <p className="text-4xl md:text-5xl font-black text-gray-900 mb-1.5 group-hover:gradient-text transition-all">
                  {s.value}
                </p>
                <p className="text-sm text-gray-500 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────────────────────── */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full mb-4">
            <Sparkles className="h-3.5 w-3.5" /> Domaines d'expertise
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">Explorez par domaine</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Choisissez votre domaine et commencez à apprendre avec des experts du secteur.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {CATEGORIES.map((cat) => (
            <Link key={cat.name} href="/courses" className="group">
              <div className={`relative overflow-hidden rounded-2xl border bg-white p-6 card-hover ring-0 group-hover:ring-2 ${cat.ring} transition-all duration-300`}>
                <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center mb-4 text-2xl shadow-lg group-hover:-translate-y-0.5 transition-transform`}>
                  {cat.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-sm md:text-base mb-1 group-hover:text-gray-700 transition-colors">{cat.name}</h3>
                <p className="text-xs text-gray-400 mb-3">{cat.count} cours disponibles</p>
                <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Voir les cours <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-gray-50 to-white border-y border-gray-100">
        <div className="container mx-auto px-4 py-24">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-violet-600 bg-violet-50 px-3 py-1 rounded-full mb-4">
              <Zap className="h-3.5 w-3.5" /> Pourquoi LearnHub
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">Tout pour votre succès</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Tout ce dont vous avez besoin pour progresser rapidement et efficacement.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl border border-gray-100 p-6 card-hover group">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${f.color} mb-4 shadow-md group-hover:-translate-y-0.5 transition-transform`}>
                  <f.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────────── */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full mb-4">
            <Star className="h-3.5 w-3.5 fill-current" /> Avis apprenants
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">Ils ont transformé leur carrière</h2>
          <p className="text-gray-500">Rejoignez des milliers d'apprenants qui ont évolué grâce à LearnHub.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl border border-gray-100 p-6 card-hover relative">
              <div className="absolute top-5 right-5 text-4xl font-black text-gray-100 leading-none">"</div>
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-5 relative z-10">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white text-sm font-bold shadow-md`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="mx-4 mb-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-950 via-slate-900 to-gray-900 text-white text-center px-8 py-20">
          <div className="absolute inset-0 pattern-dots opacity-20" />
          <div className="absolute inset-0 pattern-mesh" />
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-[80px]" />
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-violet-500/10 blur-[80px]" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/8 border border-white/10 px-4 py-1.5 text-sm font-medium mb-6">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-400" /> Accès gratuit — Aucune carte bancaire requise
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-4">Prêt à commencer ?</h2>
            <p className="text-gray-400 mb-10 max-w-lg mx-auto text-lg leading-relaxed">
              Rejoignez 12 000+ apprenants et commencez votre parcours vers l'expertise tech dès aujourd'hui.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register" className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold px-8 py-4 hover:from-emerald-400 hover:to-teal-400 transition-all shadow-xl shadow-emerald-900/50">
                Créer un compte gratuit <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/courses" className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 text-white font-bold px-8 py-4 hover:bg-white/10 transition-all backdrop-blur-sm">
                <BookOpen className="h-5 w-5" /> Voir les cours
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
