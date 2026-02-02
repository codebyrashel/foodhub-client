import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { API_BASE } from "./api";
import type { Me, Role } from "./me";

async function serverGetMe(): Promise<Me | null> {
  // forward cookies to backend so session is recognized
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const res = await fetch(`${API_BASE}/api/me`, {
    method: "GET",
    headers: {
      Cookie: cookieHeader,
    },
    cache: "no-store",
  });

  if (!res.ok) return null;
  return (await res.json()) as Me;
}

export async function requireUser() {
  const me = await serverGetMe();
  if (!me) redirect("/login");
  if (me.status === "suspended") redirect("/suspended");
  return me;
}

export async function requireRole(roles: Role[]) {
  const me = await requireUser();
  if (!roles.includes(me.role)) redirect("/forbidden");
  return me;
}