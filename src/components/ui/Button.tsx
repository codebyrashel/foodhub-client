import { cn } from "@/lib/cn";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
  loading?: boolean;
};

export function Button({ variant = "primary", loading, className, ...props }: Props) {
  return (
    <button
      {...props}
      disabled={props.disabled || loading}
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-2xl px-5 text-sm font-semibold transition",
        "disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary"
          ? "bg-orange-500 text-white hover:bg-orange-600"
          : "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
        className,
      )}
    >
      {loading ? "Please wait..." : props.children}
    </button>
  );
}