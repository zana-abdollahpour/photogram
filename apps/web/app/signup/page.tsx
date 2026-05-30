import Link from "next/link";

import SignupForm from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <div className="bg-background flex min-h-dvh items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-foreground mt-6 text-3xl font-extrabold">
            Create your account
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary hover:text-primary/90 font-medium"
            >
              Sign in here
            </Link>
          </p>
        </div>

        <SignupForm />
      </div>
    </div>
  );
}
