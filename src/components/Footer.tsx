import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/70 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="text-base font-semibold">FoodHub</p>
          <p className="mt-2 max-w-md text-sm text-slate-600">
            Discover meals from trusted providers, order easily, and track your delivery status.
            Cash on delivery—simple and real-world friendly.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900">Explore</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li><Link className="hover:text-slate-900" href="/meals">Meals</Link></li>
            <li><Link className="hover:text-slate-900" href="/provider">Providers</Link></li>
            <li><Link className="hover:text-slate-900" href="/categories">Categories</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900">Account</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li><Link className="hover:text-slate-900" href="/login">Login</Link></li>
            <li><Link className="hover:text-slate-900" href="/register">Register</Link></li>
            <li><Link className="hover:text-slate-900" href="/orders">My Orders</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200/70">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} FoodHub. All rights reserved.</p>
          <p>
            Built for Assignment 4 • Next.js + Express + Prisma
          </p>
        </div>
      </div>
    </footer>
  );
}