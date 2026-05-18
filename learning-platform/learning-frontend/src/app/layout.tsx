import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LearnHub — Plateforme d'apprentissage en ligne",
  description: "Découvrez des cours gratuits et payants, avec un tuteur IA intégré.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        <Navbar />
        <main>{children}</main>
        <footer className="border-t bg-white py-8 mt-16">
          <div className="container mx-auto px-4 text-center text-sm text-gray-400">
            © {new Date().getFullYear()} LearnHub — Plateforme d'apprentissage en ligne
          </div>
        </footer>
      </body>
    </html>
  );
}
