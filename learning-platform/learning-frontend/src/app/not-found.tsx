import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-7xl font-black text-blue-100 mb-4">404</div>
      <GraduationCap className="h-12 w-12 text-blue-300 mb-4" />
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Page introuvable</h1>
      <p className="text-gray-500 mb-8">La page que vous cherchez n'existe pas ou a été déplacée.</p>
      <Link href="/" className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
        Retour à l'accueil
      </Link>
    </div>
  );
}
