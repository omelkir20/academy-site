import Link from "next/link";
import { BookOpen, Clock, Star, Users } from "lucide-react";
import type { Course } from "@/lib/api";
import { formatDuration, formatPrice, levelLabel } from "@/lib/utils";

interface CourseCardProps {
  course: Course;
}

const LEVEL_COLORS: Record<string, string> = {
  beginner: "bg-green-100 text-green-700",
  intermediate: "bg-yellow-100 text-yellow-700",
  advanced: "bg-red-100 text-red-700",
};

export function CourseCard({ course }: CourseCardProps) {
  const totalDuration = 0;

  return (
    <Link href={`/courses/${course.id}`}>
      <div className="group flex flex-col rounded-xl border bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
        <div className="h-44 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
          {course.thumbnail_url ? (
            <img src={course.thumbnail_url} alt={course.title} className="h-full w-full object-cover" />
          ) : (
            <BookOpen className="h-16 w-16 text-white/60" />
          )}
        </div>

        <div className="flex flex-col gap-3 p-4">
          <div className="flex items-center justify-between">
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${LEVEL_COLORS[course.level] || "bg-gray-100 text-gray-600"}`}>
              {levelLabel(course.level)}
            </span>
            {course.category && (
              <span className="text-xs text-gray-400">{course.category.name}</span>
            )}
          </div>

          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {course.title}
          </h3>

          {course.description && (
            <p className="text-sm text-gray-500 line-clamp-2">{course.description}</p>
          )}

          <div className="mt-auto flex items-center justify-between pt-2 border-t">
            <span className={`text-sm font-semibold ${course.is_free ? "text-green-600" : "text-gray-900"}`}>
              {formatPrice(Number(course.price), course.is_free)}
            </span>
            <span className="text-xs text-gray-400">
              {new Date(course.created_at).toLocaleDateString("fr-FR")}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
