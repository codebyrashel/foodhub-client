import { cn } from "@/lib/cn";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none",
        "focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15",
        props.className,
      )}
    />
  );
}