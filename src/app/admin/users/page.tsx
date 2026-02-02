import { requireRole } from "@/lib/guards";
import { adminGetUsers } from "@/lib/admin-api";
import UsersTable from "./ui/UsersTable";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  await requireRole(["admin"]);

  try {
    const users = await adminGetUsers();
    return <UsersTable initialUsers={users} />;
  } catch (e: any) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        {e?.message || "Failed to load users"}
      </div>
    );
  }
}