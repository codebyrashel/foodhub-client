"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { Menu, X, UtensilsCrossed, ShoppingBag, User, LogOut, LayoutDashboard } from "lucide-react";
import { getMe, type Me } from "@/lib/me";
import { signOut } from "@/lib/auth-client";

import type { Route } from "next";

const navLinks: { href: Route; label: string }[] = [
  { href: "/meals", label: "Meals" },
  { href: "/provider", label: "Providers" },
  { href: "/categories", label: "Categories" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [me, setMe] = useState<Me | null>(null);
  const [loadingMe, setLoadingMe] = useState(true);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getMe();
        setMe(data);
      } catch {
        setMe(null);
      } finally {
        setLoadingMe(false);
      }
    })();
  }, [pathname]);

  const dashboardHref =
    me?.role === "admin" ? "/admin" : me?.role === "provider" ? "/provider/dashboard" : "/orders";

  async function handleLogout() {
    try {
      await signOut();
    } catch {
      // even if signout fails, we still reset UI and redirect
    } finally {
      setMe(null);
      router.push("/");
      router.refresh();
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-white">
            <UtensilsCrossed className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold">FoodHub</p>
            <p className="text-xs text-slate-500">Discover & order meals</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => {
            const active = pathname === l.href || pathname?.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm font-medium transition",
                  active ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100",
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            <ShoppingBag className="h-4 w-4" />
            Cart
          </Link>

          {loadingMe ? (
            <div className="h-10 w-28 animate-pulse rounded-xl bg-slate-100" />
          ) : me ? (
            <>
              <Link
                href={dashboardHref}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/profile"
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600"
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600"
            >
              <User className="h-4 w-4" />
              Login
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 p-2 md:hidden"
          onClick={() => setOpen((s) => !s)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-slate-200/70 bg-white md:hidden">
          <div className="mx-auto max-w-6xl space-y-2 px-4 py-3">
            <div className="grid gap-2">
              {navLinks.map((l) => {
                const active = pathname === l.href || pathname?.startsWith(l.href + "/");
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={cn(
                      "rounded-xl px-3 py-2 text-sm font-medium",
                      active ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-800",
                    )}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </div>

            <div className="grid gap-2 pt-2">
              <Link
                href="/cart"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium"
              >
                <ShoppingBag className="h-4 w-4" />
                Cart
              </Link>

              {loadingMe ? (
                <div className="h-10 animate-pulse rounded-xl bg-slate-100" />
              ) : me ? (
                <>
                  <Link
                    href={dashboardHref}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-3 py-2 text-sm font-semibold text-white"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-3 py-2 text-sm font-semibold text-white"
                >
                  <User className="h-4 w-4" />
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}