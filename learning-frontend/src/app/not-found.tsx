import Link from "next/link";
import { ArrowLeft, BookOpen, GraduationCap } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pattern-dots opacity-40" />
      <div className="absolute top-20 left-1/4 h-64 w-64 rounded-full bg-blue-100 blur-3xl" />
      <div className="absolute bottom-20 right-1/4 h-48 w-48 rounded-full bg-indigo-100 blur-3xl" />

      <div className="relative">
        {/* 404 */}
        <div className="relative mb-6">
          <p className="text-[10rem] md:text-[14rem] font-black text-gray-100 leading-none select-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-24 w-24 rounded-3xl bg-blue-600 flex items-center justify-center shadow-xl animate-float">
              <GraduationCap className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">
          Page introuvable
        </h1>
        <p className="text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed">
          La page que vous cherchez n'existe pas ou a été déplacée. Mais votre prochain cours, lui, vous attend !
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-2xl bg-gray-900 text-white px-6 py-3 font-semibold hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Retour à l'accueil
          </Link>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 text-white px-6 py-3 font-semibold hover:bg-blue-700 transition-colors"
          >
            <BookOpen className="h-4 w-4" /> Explorer les cours
          </Link>
        </div>
      </div>
    </div>
  );
}
