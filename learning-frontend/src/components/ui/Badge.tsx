interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
}

const VARIANTS: Record<string, string> = {
  default: "bg-gray-100 text-gray-600 border-gray-200",
  success: "bg-emerald-100 text-emerald-700 border-emerald-200",
  warning: "bg-amber-100 text-amber-700 border-amber-200",
  danger:  "bg-rose-100 text-rose-700 border-rose-200",
  info:    "bg-sky-100 text-sky-700 border-sky-200",
};

export function Badge({ children, variant = "default" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${VARIANTS[variant]}`}>
      {children}
    </span>
  );
}
