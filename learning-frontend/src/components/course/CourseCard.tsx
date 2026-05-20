import Link from "next/link";
import { ArrowRight, Clock, Users } from "lucide-react";
import type { Course } from "@/lib/api";
import { formatPrice, levelLabel } from "@/lib/utils";

interface CourseCardProps {
  course: Course;
}

const LEVEL_STYLES: Record<string, { label: string; cls: string }> = {
  beginner:     { label: "Débutant",      cls: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  intermediate: { label: "Intermédiaire", cls: "bg-amber-100 text-amber-700 border-amber-200" },
  advanced:     { label: "Avancé",        cls: "bg-rose-100 text-rose-700 border-rose-200" },
};

const CATEGORY_GRADIENTS: Record<string, string> = {
  devops:   "from-sky-500 to-cyan-600",
  cloud:    "from-blue-500 to-indigo-600",
  ia:       "from-violet-500 to-purple-600",
  python:   "from-emerald-500 to-teal-600",
  securite: "from-rose-500 to-red-600",
  "dev-web":"from-amber-500 to-orange-600",
};

const CATEGORY_ICONS: Record<string, string> = {
  devops:   "⚙️",
  cloud:    "☁️",
  ia:       "🤖",
  python:   "🐍",
  securite: "🛡️",
  "dev-web":"🌐",
};

export function CourseCard({ course }: CourseCardProps) {
  const slug = course.category?.slug ?? "devops";
  const gradient = CATEGORY_GRADIENTS[slug] ?? "from-emerald-500 to-teal-600";
  const emoji = CATEGORY_ICONS[slug] ?? "📚";
  const level = LEVEL_STYLES[course.level] ?? { label: levelLabel(course.level), cls: "bg-gray-100 text-gray-600 border-gray-200" };

  return (
    <Link href={`/courses/${course.id}`} className="group block h-full">
      <article className="flex flex-col h-full rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm group-hover:shadow-2xl group-hover:shadow-gray-200/80 group-hover:-translate-y-1.5 transition-all duration-300">

        <div className={`relative h-44 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}>
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 70% 30%, rgba(255,255,255,0.3) 0%, transparent 60%)" }} />
          {course.thumbnail_url ? (
            <img
              src={course.thumbnail_url}
              alt={course.title}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="text-5xl drop-shadow-lg group-hover:scale-110 transition-transform duration-300">{emoji}</div>
          )}

          {course.is_free && (
            <div className="absolute top-3 left-3 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white shadow-lg shadow-emerald-900/30">
              GRATUIT
            </div>
          )}

          {course.category && (
            <div className="absolute bottom-3 right-3 rounded-full bg-black/25 backdrop-blur-sm px-2.5 py-0.5 text-xs text-white font-medium">
              {course.category.name}
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1 p-5 gap-3">
          <span className={`self-start rounded-full border px-2.5 py-0.5 text-xs font-semibold ${level.cls}`}>
            {level.label}
          </span>

          <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors">
            {course.title}
          </h3>

          {course.description && (
            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed flex-1">
              {course.description}
            </p>
          )}

          <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between gap-2">
            <span className={`text-base font-bold ${course.is_free ? "text-emerald-600" : "text-gray-900"}`}>
              {formatPrice(Number(course.price), course.is_free)}
            </span>
            <span className="flex items-center gap-1 text-xs font-semibold text-gray-400 group-hover:text-emerald-600 transition-colors">
              Voir le cours <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
