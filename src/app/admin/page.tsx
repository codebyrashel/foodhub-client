import Link from "next/link";
import { requireRole } from "@/lib/guards";
import { adminGetOrders, adminGetUsers } from "@/lib/admin-api";

export const dynamic = "force-dynamic";

import type { Route } from "next";

function Tile({
  title,
  value,
  href,
}: {
  title: string;
  value: string;
  href: any;
}) {
  return (
    <Link
      href={href}
      className='rounded-3xl border border-slate-200 bg-white p-6 hover:shadow-sm transition'>
      <p className='text-sm font-semibold text-slate-900'>{title}</p>
      <p className='mt-3 text-3xl font-bold tracking-tight text-slate-900'>
        {value}
      </p>
      <p className='mt-2 text-sm font-semibold text-orange-600'>Open →</p>
    </Link>
  );
}

export default async function AdminDashboardPage() {
  await requireRole(["admin"]);

  let usersCount = 0;
  let ordersCount = 0;

  try {
    const [users, orders] = await Promise.all([
      adminGetUsers(),
      adminGetOrders(),
    ]);
    usersCount = users.length;
    ordersCount = orders.length;
  } catch {}

  return (
    <div className='space-y-6'>
      <div className='rounded-3xl border border-slate-200 bg-white p-6 md:p-8'>
        <h1 className='text-2xl font-bold tracking-tight text-slate-900'>
          Admin dashboard
        </h1>
        <p className='mt-1 text-sm text-slate-600'>
          Manage users, categories, and monitor all orders.
        </p>
      </div>

      <div className='grid gap-4 md:grid-cols-3'>
        <Tile title='Users' value={String(usersCount)} href='/admin/users' />
        <Tile title='Orders' value={String(ordersCount)} href='/admin/orders' />
        <Tile title='Categories' value='Manage' href='/admin/categories' />
      </div>
    </div>
  );
}
