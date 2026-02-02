import Link from "next/link";
import { getProviders } from "@/lib/providers";

export const dynamic = "force-dynamic";

const fallbackCover =
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1400&q=80";

export default async function ProvidersPage() {
  let providers = [];
  let error: string | null = null;

  try {
    providers = await getProviders();
  } catch (e: any) {
    error = e?.message || "Failed to load providers";
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Providers</h1>
        <p className="mt-1 text-sm text-slate-600">
          Explore active restaurants and kitchens with available meals.
        </p>
      </div>

      {error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error}
        </div>
      ) : providers.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
          <p className="text-base font-semibold text-slate-900">No providers found</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {providers.map((p: any) => {
            const cover = p.providerProfile?.coverImageUrl || fallbackCover;
            const title = p.providerProfile?.restaurantName || p.name;
            const subtitle = p.providerProfile
              ? `${p.providerProfile.cuisineType} • ${p.providerProfile.address}`
              : "Provider profile";

            return (
              <Link
                key={p.id}
                href={`/providers/${p.id}`}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:shadow-sm"
              >
                <div
                  className="h-40 bg-cover bg-center transition group-hover:scale-[1.02]"
                  style={{ backgroundImage: `url(${cover})` }}
                />
                <div className="p-5">
                  <p className="truncate text-sm font-semibold text-slate-900">{title}</p>
                  <p className="mt-2 line-clamp-2 text-xs text-slate-600">{subtitle}</p>
                  <p className="mt-4 text-xs font-semibold text-orange-600">View menu →</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}