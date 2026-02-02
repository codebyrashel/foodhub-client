"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const router = useRouter();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("Verifying your email...");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("No verification token found.");
            return;
        }

        // Call verifyEmail using the auth client
        authClient.verifyEmail({
            query: { token },
            fetchOptions: {
                onError: (ctx: { error: { message: string } }) => {
                    setStatus("error");
                    setMessage(ctx.error.message || "Verification failed");
                },
                onSuccess: () => {
                    setStatus("success");
                    setMessage("Email verified successfully!");
                    // Optional: redirect after delay
                    setTimeout(() => router.push("/auth/sign-in"), 3000);
                },
            },
        });
    }, [token, router]);

    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            {status === "loading" && (
                <>
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                    <p className="text-lg">{message}</p>
                </>
            )}
            {status === "success" && (
                <>
                    <CheckCircle2 className="h-12 w-12 text-green-600" />
                    <h1 className="text-2xl font-bold">Verified!</h1>
                    <p className="text-gray-600 dark:text-gray-400">{message}</p>
                    <p className="text-sm text-gray-500">Redirecting to login...</p>
                </>
            )}
            {status === "error" && (
                <>
                    <XCircle className="h-12 w-12 text-red-600" />
                    <h1 className="text-2xl font-bold">Verification Failed</h1>
                    <p className="text-gray-600 dark:text-gray-400">{message}</p>
                    <Link
                        href={"/auth/sign-in" as any}
                        className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        Back to Sign In
                    </Link>
                </>
            )}
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
            <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
                <VerifyEmailContent />
            </Suspense>
        </div>
    );
}
