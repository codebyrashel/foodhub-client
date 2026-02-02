import { requireUser } from "@/lib/guards";

export default async function ProviderOnboardingPage() {
  await requireUser();

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Provider onboarding</h1>
      <p className="mt-2 text-sm text-slate-600">
        Complete your restaurant profile to start listing meals.
      </p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
        Next step: we will add the profile form and connect it to{" "}
        <span className="font-semibold">POST /api/onboarding/provider</span>.
      </div>
    </div>
  );
}