import Link from "next/link";
import { requireRole } from "@/lib/guards";
import { getProviderProfile } from "@/lib/provider-api";

export const dynamic = "force-dynamic";

export default async function ProviderDashboardPage() {
  await requireRole(["provider"]);

  let profile = null;
  let error: string | null = null;

  try {
    profile = await getProviderProfile();
  } catch (e: any) {
    error = e?.message || "Failed to load provider profile";
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Provider dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">
          Manage your menu and fulfill incoming orders.
        </p>
      </div>

      {error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error}
        </div>
      ) : profile ? (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:col-span-2">
            <p className="text-sm font-semibold text-slate-900">Restaurant</p>
            <p className="mt-2 text-lg font-bold">{profile.restaurantName}</p>
            <p className="mt-1 text-sm text-slate-600">
              {profile.cuisineType} • {profile.address}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-semibold text-slate-900">Quick actions</p>
            <div className="mt-4 grid gap-2">
              <Link
                href="/provider/menu"
                className="inline-flex h-11 items-center justify-center rounded-2xl bg-orange-500 px-5 text-sm font-semibold text-white hover:bg-orange-600"
              >
                Manage menu
              </Link>
              <Link
                href="/provider/orders"
                className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 px-5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                View orders
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}