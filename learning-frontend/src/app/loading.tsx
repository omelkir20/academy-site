import { GraduationCap, Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center animate-pulse shadow-xl shadow-emerald-200">
        <GraduationCap className="h-7 w-7 text-white" />
      </div>
      <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
      <p className="text-sm text-gray-400 font-medium">Chargement…</p>
    </div>
  );
}
