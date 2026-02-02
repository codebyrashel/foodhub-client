import Link from "next/link";

const heroImage =
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1600&q=80";

const featureCards = [
  {
    title: "Cash on Delivery",
    desc: "Order confidently with COD—simple and practical for real-life delivery.",
    img: "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Trusted Providers",
    desc: "Explore restaurants and home kitchens with clear profiles and menus.",
    img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Track Order Status",
    desc: "Placed → Preparing → Ready → Delivered with clear updates.",
    img: "https://images.unsplash.com/photo-1526318472351-c75fcf070305?auto=format&fit=crop&w=1200&q=80",
  },
];

const categories = [
  { name: "Bangla", img: "https://images.unsplash.com/photo-1604908176997-125f25cc500f?auto=format&fit=crop&w=1200&q=80" },
  { name: "Indian", img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80" },
  { name: "Chinese", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=1200&q=80" },
  { name: "Healthy", img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80" },
];

export default function HomePage() {
  return (
    <div className="space-y-14">
      {/* Section 1: Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/55 to-slate-950/20" />
        <div className="relative px-6 py-14 md:px-10 md:py-20">
          <div className="max-w-2xl">
            <p className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/20">
              Discover • Order • Track
            </p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-5xl">
              Delicious meals from local providers—delivered to your door
            </h1>
            <p className="mt-4 text-sm leading-6 text-white/80 md:text-base">
              Browse menus, filter by category and price, order with Cash on Delivery,
              and track your order status in real time.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/meals"
                className="inline-flex items-center justify-center rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600"
              >
                Browse Meals
              </Link>
              <Link
                href="/provider"
                className="inline-flex items-center justify-center rounded-2xl bg-white/10 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/25 hover:bg-white/15"
              >
                Explore Providers
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 text-white/85 sm:max-w-md">
              <div className="rounded-2xl bg-white/10 p-3 ring-1 ring-white/15">
                <p className="text-lg font-bold">COD</p>
                <p className="text-xs">No online payment</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-3 ring-1 ring-white/15">
                <p className="text-lg font-bold">Fast</p>
                <p className="text-xs">Quick updates</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-3 ring-1 ring-white/15">
                <p className="text-lg font-bold">Real</p>
                <p className="text-xs">Local providers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Featured Categories */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
              Popular categories
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Pick your craving and start exploring meals.
            </p>
          </div>
          <Link className="text-sm font-semibold text-orange-600 hover:text-orange-700" href="/categories">
            View all
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.name}
              href="/meals"
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white"
            >
              <div
                className="h-36 bg-cover bg-center transition group-hover:scale-[1.02]"
                style={{ backgroundImage: `url(${c.img})` }}
              />
              <div className="p-4">
                <p className="text-sm font-semibold text-slate-900">{c.name}</p>
                <p className="mt-1 text-xs text-slate-600">Explore meals</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Section 3: Why FoodHub */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
            Why FoodHub
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Built around real ordering flow for customers and providers.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {featureCards.map((f) => (
            <div key={f.title} className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
              <div
                className="h-40 bg-cover bg-center"
                style={{ backgroundImage: `url(${f.img})` }}
              />
              <div className="p-5">
                <p className="text-base font-semibold text-slate-900">{f.title}</p>
                <p className="mt-2 text-sm text-slate-600">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4: CTA */}
      <section className="rounded-3xl border border-slate-200 bg-white p-7 md:p-10">
        <div className="grid items-center gap-6 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
              Ready to order?
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Create an account as a customer, or onboard as a provider to list your meals.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Create account
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              Become a provider
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}