import Link from "next/link";

export default function NotFound() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
      <p className="text-base font-semibold text-slate-900">Page not found</p>
      <p className="mt-2 text-sm text-slate-600">
        The page you’re looking for does not exist or was moved.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-2xl bg-orange-500 px-5 text-sm font-semibold text-white hover:bg-orange-600"
        >
          Go home
        </Link>
        <Link
          href="/meals"
          className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 px-5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
        >
          Browse meals
        </Link>
      </div>
    </div>
  );
}