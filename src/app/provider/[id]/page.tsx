import Link from "next/link";
import { getProvider } from "@/lib/providers";
import { formatMoney } from "@/lib/money";
import AddProviderMealToCart from "./ui/AddProviderMealToCart";

export const dynamic = "force-dynamic";

const fallbackCover =
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=80";
const fallbackMealImg =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80";

export default async function ProviderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let provider;
  try {
    provider = await getProvider(id);
  } catch (e: any) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        {e?.message || "Failed to load provider"}
      </div>
    );
  }

  const title = provider.providerProfile?.restaurantName || provider.name;
  const cover = provider.providerProfile?.coverImageUrl || fallbackCover;

  return (
    <div className="space-y-6">
      <div className="text-sm text-slate-600">
        <Link className="font-semibold text-orange-600 hover:text-orange-700" href="/provider">
          ← Back to providers
        </Link>
      </div>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <div className="relative">
          <div className="h-56 bg-cover bg-center" style={{ backgroundImage: `url(${cover})` }} />
          <div className="absolute inset-0 bg-linear-to-r from-slate-950/50 via-slate-950/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">{title}</h1>
            {provider.providerProfile && (
              <p className="mt-1 text-sm text-white/85">
                {provider.providerProfile.cuisineType} • {provider.providerProfile.address}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Menu</h2>
            <p className="mt-1 text-sm text-slate-600">
              Add items to cart. Orders must contain meals from a single provider.
            </p>
          </div>
          <Link href="/cart" className="text-sm font-semibold text-orange-600 hover:text-orange-700">
            Go to cart →
          </Link>
        </div>

        {provider.meals.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700">
            No available meals right now.
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {provider.meals.map((m) => (
              <div key={m.id} className="overflow-hidden rounded-3xl border border-slate-200">
                <div
                  className="h-40 bg-cover bg-center"
                  style={{ backgroundImage: `url(${m.imageUrl || fallbackMealImg})` }}
                />
                <div className="bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">{m.name}</p>
                      <p className="mt-1 text-xs text-slate-600">{m.category.name}</p>
                    </div>
                    <p className="shrink-0 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                      {formatMoney(m.price)}
                    </p>
                  </div>

                  {m.description && (
                    <p className="mt-3 line-clamp-2 text-xs text-slate-600">{m.description}</p>
                  )}

                  <div className="mt-4 flex items-center justify-between gap-2">
                    <Link
                      href={`/meals/${m.id}`}
                      className="text-xs font-semibold text-slate-700 hover:text-slate-900"
                    >
                      View →
                    </Link>

                    <AddProviderMealToCart providerId={provider.id} mealId={m.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}