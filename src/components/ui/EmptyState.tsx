import Link from "next/link";

export default function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
      <p className="text-base font-semibold text-slate-900">{title}</p>
      {description && <p className="mt-2 text-sm text-slate-600">{description}</p>}
      {actionHref && actionLabel && (
        <div className="mt-6">
          <Link
            href={actionHref}
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-orange-500 px-5 text-sm font-semibold text-white hover:bg-orange-600"
          >
            {actionLabel}
          </Link>
        </div>
      )}
    </div>
  );
}