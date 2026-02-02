import Link from "next/link";
import { Mail } from "lucide-react";

export default function VerifyEmailSentPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                <Mail className="h-8 w-8 text-blue-600 dark:text-blue-300" />
            </div>
            <h1 className="mb-2 text-2xl font-bold">Check your email</h1>
            <p className="mb-6 max-w-sm text-gray-600 dark:text-gray-400">
                We&apos;ve sent you a verification link. Please check your inbox and confirm your email address to continue.
            </p>
            <Link
                href={"/auth/sign-in" as any}
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
                Back to Sign In
            </Link>
        </div>
    );
}
