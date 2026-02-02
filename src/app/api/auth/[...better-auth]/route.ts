const API_BASE = process.env.API_BASE_URL!;

export const runtime = "nodejs";

async function handler(req: Request) {
  const url = new URL(req.url);
  const pathname = url.pathname.replace("/api/auth", "");

  const targetUrl = `${API_BASE}/api/auth${pathname}${url.search}`;

  const response = await fetch(targetUrl, {
    method: req.method,
    headers: req.headers,
    body: req.method === "GET" ? undefined : await req.text(),
    credentials: "include",
  });

  return new Response(response.body, {
    status: response.status,
    headers: response.headers,
  });
}

export async function GET(req: Request) {
  return handler(req);
}

export async function POST(req: Request) {
  return handler(req);
}
