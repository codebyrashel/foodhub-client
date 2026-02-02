export default function MealsLoading() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
        <div className="h-6 w-40 animate-pulse rounded bg-slate-100" />
        <div className="mt-3 h-4 w-72 animate-pulse rounded bg-slate-100" />
        <div className="mt-6 grid gap-3 md:grid-cols-12">
          <div className="md:col-span-4 h-11 animate-pulse rounded-2xl bg-slate-100" />
          <div className="md:col-span-3 h-11 animate-pulse rounded-2xl bg-slate-100" />
          <div className="md:col-span-2 h-11 animate-pulse rounded-2xl bg-slate-100" />
          <div className="md:col-span-2 h-11 animate-pulse rounded-2xl bg-slate-100" />
          <div className="md:col-span-1 h-11 animate-pulse rounded-2xl bg-slate-100" />
          <div className="md:col-span-12 h-11 animate-pulse rounded-2xl bg-slate-100" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
            <div className="h-44 animate-pulse bg-slate-100" />
            <div className="space-y-3 p-4">
              <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
              <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
              <div className="h-3 w-5/6 animate-pulse rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}