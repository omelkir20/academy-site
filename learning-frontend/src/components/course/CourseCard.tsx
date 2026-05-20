import Link from "next/link";
import { BookOpen, Star, Users, Clock, ArrowRight } from "lucide-react";
import type { Course } from "@/lib/api";
import { formatPrice, levelLabel } from "@/lib/utils";

interface CourseCardProps {
  course: Course;
}

const LEVEL_STYLES: Record<string, { label: string; cls: string }> = {
  beginner:     { label: "Débutant",      cls: "bg-green-100 text-green-700 border-green-200" },
  intermediate: { label: "Intermédiaire", cls: "bg-amber-100 text-amber-700 border-amber-200" },
  advanced:     { label: "Avancé",        cls: "bg-red-100 text-red-700 border-red-200" },
};

const CATEGORY_GRADIENTS: Record<string, string> = {
  devops:   "from-blue-500 to-cyan-600",
  cloud:    "from-sky-500 to-blue-700",
  ia:       "from-purple-500 to-indigo-700",
  python:   "from-green-500 to-emerald-700",
  securite: "from-red-500 to-rose-700",
  "dev-web":"from-orange-500 to-amber-700",
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
  const gradient = CATEGORY_GRADIENTS[slug] ?? "from-blue-500 to-indigo-600";
  const emoji = CATEGORY_ICONS[slug] ?? "📚";
  const level = LEVEL_STYLES[course.level] ?? { label: levelLabel(course.level), cls: "bg-gray-100 text-gray-600 border-gray-200" };

  return (
    <Link href={`/courses/${course.id}`} className="group block h-full">
      <article className="flex flex-col h-full rounded-2xl border bg-white overflow-hidden shadow-sm group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300">

        {/* Thumbnail */}
        <div className={`relative h-44 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}>
          {course.thumbnail_url ? (
            <img
              src={course.thumbnail_url}
              alt={course.title}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <>
              <div className="absolute inset-0 opacity-20"
                style={{ backgroundImage: "radial-gradient(circle at 30% 70%, rgba(255,255,255,0.4) 0%, transparent 60%)" }}
              />
              <div className="text-5xl drop-shadow">{emoji}</div>
            </>
          )}

          {/* Free badge */}
          {course.is_free && (
            <div className="absolute top-3 left-3 rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white shadow">
              GRATUIT
            </div>
          )}

          {/* Category */}
          {course.category && (
            <div className="absolute bottom-3 right-3 rounded-full bg-black/30 backdrop-blur-sm px-2.5 py-0.5 text-xs text-white font-medium">
              {course.category.name}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-5 gap-3">

          {/* Level */}
          <span className={`self-start rounded-full border px-2.5 py-0.5 text-xs font-semibold ${level.cls}`}>
            {level.label}
          </span>

          {/* Title */}
          <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
            {course.title}
          </h3>

          {/* Description */}
          {course.description && (
            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed flex-1">
              {course.description}
            </p>
          )}

          {/* Footer */}
          <div className="mt-auto pt-3 border-t flex items-center justify-between gap-2">
            <span className={`text-base font-bold ${course.is_free ? "text-green-600" : "text-gray-900"}`}>
              {formatPrice(Number(course.price), course.is_free)}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-400 font-medium group-hover:text-blue-600 transition-colors">
              Voir le cours <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
