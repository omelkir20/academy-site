import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import Link from "next/link";
import { GraduationCap, BookOpen, Twitter, Github, Linkedin, Mail } from "lucide-react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

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
    <html lang="fr" className={inter.variable}>
      <body className="min-h-screen bg-gray-50 font-sans">
        <Navbar />
        <main>{children}</main>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300 mt-20">
          <div className="container mx-auto px-4 pt-16 pb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
              {/* Brand */}
              <div className="lg:col-span-2">
                <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl mb-4">
                  <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  LearnHub
                </Link>
                <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                  La plateforme d'apprentissage en ligne avec tuteur IA intégré. Des cours de qualité sur le DevOps, le Cloud et l'Intelligence Artificielle.
                </p>
                <div className="flex items-center gap-3 mt-6">
                  {[
                    { icon: Twitter,  href: "#" },
                    { icon: Github,   href: "#" },
                    { icon: Linkedin, href: "#" },
                    { icon: Mail,     href: "#" },
                  ].map(({ icon: Icon, href }) => (
                    <a key={href} href={href} className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800 hover:bg-blue-600 transition-colors">
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Links */}
              {Object.entries(FOOTER_LINKS).map(([title, links]) => (
                <div key={title}>
                  <h3 className="text-white font-semibold text-sm mb-4">{title}</h3>
                  <ul className="space-y-2.5">
                    {links.map((l) => (
                      <li key={l.label}>
                        <Link href={l.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-gray-500">
                © {new Date().getFullYear()} LearnHub. Tous droits réservés.
              </p>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <BookOpen className="h-3.5 w-3.5" />
                Fait avec passion pour l'apprentissage
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
