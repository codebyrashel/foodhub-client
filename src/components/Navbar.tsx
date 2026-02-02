"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { Menu, X, UtensilsCrossed, ShoppingBag, User } from "lucide-react";

const navLinks = [
  { href: "/meals", label: "Meals" },
  { href: "/providers", label: "Providers" },
  { href: "/categories", label: "Categories" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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
                  active
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-100",
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
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600"
          >
            <User className="h-4 w-4" />
            Login
          </Link>
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
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-3 py-2 text-sm font-semibold text-white"
              >
                <User className="h-4 w-4" />
                Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}