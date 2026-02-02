"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="rounded-3xl border border-red-200 bg-red-50 p-8">
      <h2 className="text-lg font-bold text-red-800">Something went wrong</h2>
      <p className="mt-2 text-sm text-red-700">
        {error.message || "Unexpected error occurred."}
      </p>
      <button
        onClick={() => reset()}
        className="mt-6 inline-flex h-11 items-center justify-center rounded-2xl bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-800"
      >
        Try again
      </button>
    </div>
  );
}