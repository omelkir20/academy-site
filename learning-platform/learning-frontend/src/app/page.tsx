import Link from "next/link";
import { ArrowRight, BookOpen, Brain, GraduationCap, Zap } from "lucide-react";

const FEATURES = [
  { icon: BookOpen,     title: "Catalogue varié",      desc: "Cours gratuits et payants sur le DevOps, le Cloud, l'IA et bien plus." },
  { icon: Brain,        title: "Tuteur IA intégré",    desc: "Posez vos questions à tout moment et obtenez des réponses contextuelles." },
  { icon: Zap,          title: "Suivi de progression", desc: "Reprenez là où vous en étiez et visualisez votre avancement." },
  { icon: GraduationCap,title: "Certifications",       desc: "Validez vos compétences et partagez vos certificats." },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Apprenez à votre rythme,<br />
            <span className="text-blue-200">guidé par l'IA</span>
          </h1>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Des cours de qualité sur le DevOps, le Cloud et l'IA — gratuits ou abordables — avec un tuteur IA disponible 24h/24.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 rounded-xl bg-white text-blue-700 font-semibold px-8 py-4 hover:bg-blue-50 transition-colors"
            >
              Explorer les cours <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/40 text-white font-semibold px-8 py-4 hover:bg-white/10 transition-colors"
            >
              Créer un compte gratuit
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Pourquoi LearnHub ?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-xl border bg-white p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                <f.icon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-50 border-y">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Prêt à commencer ?</h2>
          <p className="text-gray-500 mb-8">Rejoignez des milliers d'apprenants et commencez gratuitement dès aujourd'hui.</p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white font-semibold px-8 py-4 hover:bg-blue-700 transition-colors"
          >
            Voir les cours gratuits <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
