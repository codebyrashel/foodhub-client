"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { signInEmail } from "@/lib/auth-client";
import { getMe } from "@/lib/me";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signInEmail({ email, password });

      const me = await getMe();

      if (me.status === "suspended") {
        router.push("/suspended");
        return;
      }

      if (me.role === "admin") router.push("/admin");
      else if (me.role === "provider") {
        router.push(me.providerProfile ? "/provider/dashboard" : "/onboarding/providers");
      } else {
        router.push("/meals");
      }
    } catch (err: Error | unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
      <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white lg:block">
        <div
          className="h-full min-h-130 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=1400&q=80)",
          }}
        />
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-600">
          Login to order meals, manage your menu, or access admin tools.
        </p>

        {error && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
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
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button loading={loading} className="w-full" type="submit">
            Login
          </Button>

          <div className="text-center text-sm text-slate-600">
            Don’t have an account?{" "}
            <Link className="font-semibold text-orange-600 hover:text-orange-700" href="/register">
              Register
            </Link>
          </div>
        </form>

        <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-xs text-slate-600">
          If you just registered, you may need to verify your email before logging in (email
          verification is required).
        </div>
      </div>
    </div>
  );
}