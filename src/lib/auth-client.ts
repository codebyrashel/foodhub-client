import { API_BASE } from "./api";

type BetterAuthResponse<T> = T;

async function authFetch<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = data?.message || data?.error || "Request failed";
    const err = new Error(message) as Error & { status?: number; details?: unknown };
    err.status = res.status;
    err.details = data;
    throw err;
  }

  return data as BetterAuthResponse<T>;
}

// Based on your seed script usage: auth.api.signUpEmail({ body: { email, password, name } })
export function signUpEmail(input: { name: string; email: string; password: string }) {
  return authFetch("/api/auth/sign-up/email", input);
}

// Better Auth usually supports: /sign-in/email
export function signInEmail(input: { email: string; password: string }) {
  return authFetch("/api/auth/sign-in/email", input);
}

export async function signOut() {
  // Better Auth commonly: /sign-out
  return authFetch("/api/auth/sign-out");
}