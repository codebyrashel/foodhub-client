import { cn } from "@/lib/cn";

export function Alert({
  variant = "info",
  title,
  children,
}: {
  variant?: "info" | "error" | "success" | "warning";
  title?: string;
  children: React.ReactNode;
}) {
  const styles: Record<string, string> = {
    info: "border-slate-200 bg-slate-50 text-slate-700",
    error: "border-red-200 bg-red-50 text-red-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    warning: "border-amber-200 bg-amber-50 text-amber-800",
  };

  return (
    <div className={cn("rounded-3xl border p-6 text-sm", styles[variant])}>
      {title && <p className="text-base font-bold mb-2">{title}</p>}
      {children}
    </div>
  );
}