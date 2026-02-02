"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { signUpEmail } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";

type RoleChoice = "customer" | "provider";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<RoleChoice>("customer");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canSubmit = useMemo(() => name.trim().length >= 2 && email && password.length >= 6, [name, email, password]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signUpEmail({ name, email, password });

      // backend has autoSignIn: false, requireEmailVerification: true
      // so we show a success hint and send user to login
      // If role chosen is provider, we will onboard after login
      router.push(`/login?registered=1&role=${role}`);
    } catch (err: any) {
      setError(err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create your account</h1>
        <p className="mt-2 text-sm text-slate-600">
          Choose your role and get started with FoodHub.
        </p>

        {error && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label>I want to join as</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("customer")}
                className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                  role === "customer"
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                }`}
              >
                Customer
                <p className={`mt-1 text-xs font-normal ${role === "customer" ? "text-white/80" : "text-slate-600"}`}>
                  Browse meals, order, track status, review meals
                </p>
              </button>

              <button
                type="button"
                onClick={() => setRole("provider")}
                className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                  role === "provider"
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                }`}
              >
                Provider
                <p className={`mt-1 text-xs font-normal ${role === "provider" ? "text-white/80" : "text-slate-600"}`}>
                  Create menu items and fulfill incoming orders
                </p>
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Admin accounts are seeded from the backend and cannot be registered here.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <Button loading={loading} className="w-full" type="submit" disabled={!canSubmit}>
            Create account
          </Button>

          <div className="text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link className="font-semibold text-orange-600 hover:text-orange-700" href="/login">
              Login
            </Link>
          </div>
        </form>

        <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-xs text-slate-600">
          Email verification is required by the backend. After registering, verify your email then login.
        </div>
      </div>

      <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white lg:block">
        <div
          className="h-full min-h-[560px] bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1400&q=80)",
          }}
        />
      </div>
    </div>
  );
}