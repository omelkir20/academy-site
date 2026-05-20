import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import Link from "next/link";
import { GraduationCap, Twitter, Github, Linkedin, Mail, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "LearnHub — Plateforme d'apprentissage en ligne",
  description: "Découvrez des cours gratuits et payants sur le DevOps, le Cloud et l'IA, avec un tuteur IA intégré.",
  keywords: ["formation", "cours en ligne", "DevOps", "Cloud", "IA", "cybersécurité", "Python"],
};

const FOOTER_LINKS = {
  Plateforme: [
    { label: "Catalogue de cours", href: "/courses" },
    { label: "Tuteur IA",          href: "/courses" },
    { label: "Certifications",     href: "/courses" },
    { label: "Tableau de bord",    href: "/dashboard" },
  ],
  Compte: [
    { label: "Connexion",    href: "/auth/login" },
    { label: "Inscription",  href: "/auth/register" },
    { label: "Mon profil",   href: "/profile" },
  ],
  Catégories: [
    { label: "DevOps & Cloud", href: "/courses" },
    { label: "Python & Data",  href: "/courses" },
    { label: "IA & LLM",       href: "/courses" },
    { label: "Cybersécurité",  href: "/courses" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-gray-50 font-sans">
        <Navbar />
        <main>{children}</main>

        <footer className="bg-gray-950 text-gray-400 mt-20 border-t border-white/5">
          <div className="container mx-auto px-4 pt-16 pb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
              <div className="lg:col-span-2">
                <Link href="/" className="flex items-center gap-2.5 text-white font-bold text-xl mb-4">
                  <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-900/50">
                    <GraduationCap className="h-4.5 w-4.5 text-white" />
                  </div>
                  LearnHub
                </Link>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                  La plateforme d'apprentissage en ligne avec tuteur IA intégré. Des cours de qualité sur le DevOps, le Cloud et l'Intelligence Artificielle.
                </p>
                <div className="flex items-center gap-2.5 mt-6">
                  {[
                    { icon: Twitter,  href: "#" },
                    { icon: Github,   href: "#" },
                    { icon: Linkedin, href: "#" },
                    { icon: Mail,     href: "#" },
                  ].map(({ icon: Icon, href }, i) => (
                    <a key={i} href={href} className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-400 transition-all duration-200">
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>

              {Object.entries(FOOTER_LINKS).map(([title, links]) => (
                <div key={title}>
                  <h3 className="text-white font-semibold text-sm mb-4">{title}</h3>
                  <ul className="space-y-2.5">
                    {links.map((l) => (
                      <li key={l.label}>
                        <Link href={l.href} className="text-sm text-gray-500 hover:text-emerald-400 transition-colors duration-200">
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-gray-600">
                © {new Date().getFullYear()} LearnHub. Tous droits réservés.
              </p>
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <Zap className="h-3.5 w-3.5 text-emerald-500" />
                Propulsé par l'IA — Apprenez mieux, plus vite
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
