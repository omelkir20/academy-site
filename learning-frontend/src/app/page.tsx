import Link from "next/link";
import { ArrowRight, BookOpen, Brain, GraduationCap, Zap, Shield, Users, Star, CheckCircle, Play, TrendingUp } from "lucide-react";

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
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Brain,
    title: "Tuteur IA intégré",
    desc: "Posez vos questions à tout moment. Notre IA répond en contexte avec vos cours.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: TrendingUp,
    title: "Suivi de progression",
    desc: "Visualisez votre avancement, reprenez là où vous en étiez et mesurez vos progrès.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: GraduationCap,
    title: "Certifications",
    desc: "Validez vos compétences avec des certificats reconnus et partagez-les sur LinkedIn.",
    color: "bg-orange-50 text-orange-600",
  },
  {
    icon: Shield,
    title: "Contenu de qualité",
    desc: "Chaque cours est créé par des experts certifiés avec des années d'expérience en entreprise.",
    color: "bg-red-50 text-red-600",
  },
  {
    icon: Zap,
    title: "Accès immédiat",
    desc: "Commencez à apprendre en quelques secondes. Aucune configuration, 100% dans le navigateur.",
    color: "bg-yellow-50 text-yellow-600",
  },
];

const CATEGORIES = [
  { name: "DevOps & CI/CD",            icon: "⚙️", count: 28, color: "from-blue-500 to-blue-700" },
  { name: "Cloud (AWS, GCP, Azure)",   icon: "☁️", count: 34, color: "from-sky-500 to-blue-600" },
  { name: "Intelligence Artificielle", icon: "🤖", count: 21, color: "from-purple-500 to-indigo-600" },
  { name: "Python & Data Science",     icon: "🐍", count: 19, color: "from-green-500 to-emerald-600" },
  { name: "Cybersécurité",             icon: "🛡️", count: 16, color: "from-red-500 to-rose-600" },
  { name: "Développement Web",         icon: "🌐", count: 32, color: "from-orange-500 to-amber-600" },
];

const TESTIMONIALS = [
  {
    name: "Marie L.",
    role: "DevOps Engineer",
    avatar: "ML",
    color: "bg-blue-500",
    text: "LearnHub m'a permis de décrocher ma certification AWS en 3 mois. Le tuteur IA est bluffant, il répond exactement à mes questions de cours.",
    stars: 5,
  },
  {
    name: "Thomas B.",
    role: "Data Scientist",
    avatar: "TB",
    color: "bg-purple-500",
    text: "Les cours Python et ML sont excellents. Le contenu est à jour, pratique et bien structuré. Je recommande à tous mes collègues.",
    stars: 5,
  },
  {
    name: "Sophie M.",
    role: "Pentester",
    avatar: "SM",
    color: "bg-green-500",
    text: "La section cybersécurité est de très haute qualité. Les labs pratiques m'ont préparé à l'OSCP. Meilleure plateforme francophone.",
    stars: 5,
  },
];

export default function HomePage() {
  return (
    <div className="overflow-hidden">

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 text-white overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pattern-dots opacity-30" />
        <div className="absolute top-20 right-10 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl animate-float-slow" />
        <div className="absolute bottom-10 left-10 h-56 w-56 rounded-full bg-indigo-400/20 blur-3xl animate-float" />

        <div className="relative container mx-auto px-4 py-28 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-sm font-medium mb-8 backdrop-blur-sm">
            <Zap className="h-3.5 w-3.5 text-yellow-300" />
            Tuteur IA disponible 24h/24 — Répondez à vos questions en temps réel
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-[1.05] tracking-tight">
            Apprenez à votre rythme,
            <br />
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              guidé par l'IA
            </span>
          </h1>

          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Des formations de qualité sur le DevOps, le Cloud et l'IA — gratuites ou abordables — avec un assistant IA qui répond à toutes vos questions en contexte.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2.5 rounded-2xl bg-white text-blue-700 font-bold px-8 py-4 hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Explorer les cours <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2.5 rounded-2xl border-2 border-white/30 text-white font-bold px-8 py-4 hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              <Play className="h-4 w-4 fill-current" />
              Commencer gratuitement
            </Link>
          </div>

          {/* Hero social proof */}
          <div className="mt-12 flex items-center justify-center gap-2">
            <div className="flex -space-x-2">
              {["bg-blue-400", "bg-purple-400", "bg-green-400", "bg-orange-400", "bg-pink-400"].map((c, i) => (
                <div key={i} className={`h-8 w-8 rounded-full ${c} border-2 border-white flex items-center justify-center text-white text-xs font-bold`}>
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <p className="text-blue-100 text-sm ml-2">
              <strong className="text-white">12 000+</strong> apprenants nous font confiance
            </p>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────────── */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl md:text-4xl font-black text-gray-900 mb-1">{s.value}</p>
                <p className="text-sm text-gray-500 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────────────────────── */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">Explorez par domaine</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Choisissez votre domaine et commencez à apprendre avec des experts du secteur.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {CATEGORIES.map((cat) => (
            <Link key={cat.name} href="/courses" className="group">
              <div className="relative overflow-hidden rounded-2xl border bg-white p-6 card-hover">
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                <div className="text-3xl mb-3">{cat.icon}</div>
                <h3 className="font-bold text-gray-900 text-sm md:text-base mb-1 group-hover:text-blue-600 transition-colors">{cat.name}</h3>
                <p className="text-xs text-gray-400">{cat.count} cours disponibles</p>
                <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all absolute bottom-5 right-5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────────── */}
      <section className="bg-gray-50 border-y">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">Pourquoi choisir LearnHub ?</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Tout ce dont vous avez besoin pour progresser rapidement et efficacement.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl border p-6 card-hover">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${f.color} mb-4`}>
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────────── */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">Ils ont transformé leur carrière</h2>
          <p className="text-gray-500">Rejoignez des milliers d'apprenants qui ont évolué grâce à LearnHub.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl border p-6 card-hover">
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-5">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-full ${t.color} flex items-center justify-center text-white text-sm font-bold`}>
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
      <section className="mx-4 mb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white text-center px-8 py-16">
          <div className="absolute inset-0 pattern-dots opacity-20" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-sm font-medium mb-6">
              <CheckCircle className="h-3.5 w-3.5 text-green-300" /> Accès gratuit — Aucune carte bancaire requise
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-4">Prêt à commencer ?</h2>
            <p className="text-blue-100 mb-8 max-w-lg mx-auto text-lg">
              Rejoignez 12 000+ apprenants et commencez votre parcours vers l'expertise tech dès aujourd'hui.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register" className="inline-flex items-center gap-2 rounded-2xl bg-white text-blue-700 font-bold px-8 py-4 hover:bg-blue-50 transition-all shadow-lg">
                Créer un compte gratuit <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/courses" className="inline-flex items-center gap-2 rounded-2xl border-2 border-white/30 text-white font-bold px-8 py-4 hover:bg-white/10 transition-all">
                <BookOpen className="h-5 w-5" /> Voir les cours
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
