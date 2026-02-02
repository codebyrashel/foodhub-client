import Link from "next/link";

export default function SuspendedPage() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
      <h1 className="text-lg font-bold text-slate-900">Account suspended</h1>
      <p className="mt-2 text-sm text-slate-600">
        Your account has been suspended by an admin. Please contact support.
      </p>
      <div className="mt-6">
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-2xl bg-orange-500 px-5 text-sm font-semibold text-white hover:bg-orange-600"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}