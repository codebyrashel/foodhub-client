export default function MealDetailsLoading() {
  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-3 overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <div className="h-72 animate-pulse bg-slate-100" />
        <div className="space-y-3 p-6">
          <div className="h-6 w-1/2 animate-pulse rounded bg-slate-100" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
          <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-slate-100" />
        </div>
      </div>
      <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6">
        <div className="h-6 w-32 animate-pulse rounded bg-slate-100" />
        <div className="mt-4 h-11 animate-pulse rounded-2xl bg-slate-100" />
        <div className="mt-3 h-11 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    </div>
  );
}