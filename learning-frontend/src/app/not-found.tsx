import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="relative mb-8">
        <div className="text-[120px] font-black leading-none bg-gradient-to-br from-emerald-200 to-teal-100 bg-clip-text text-transparent select-none">
          404
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-2xl shadow-emerald-200">
            <BookOpen className="h-10 w-10 text-white" />
          </div>
        </div>
      </div>
      <h1 className="text-2xl font-black text-gray-900 mb-2">Page introuvable</h1>
      <p className="text-gray-500 mb-8 max-w-sm">
        Cette page n'existe pas ou a été déplacée. Revenez à l'accueil pour continuer à apprendre.
      </p>
      <div className="flex gap-3">
        <Link href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-bold text-white hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-200">
          <ArrowLeft className="h-4 w-4" /> Retour à l'accueil
        </Link>
        <Link href="/courses"
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all">
          Voir les cours
        </Link>
      </div>
    </div>
  );
}
