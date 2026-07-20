import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";

export default function RegisterPage() {
  return (
    <div>
      <h1 className="font-serif text-display-sm text-center text-charcoal mb-2">
        Create Account
      </h1>
      <p className="text-center text-sm text-charcoal/60 mb-8">
        Join the AUREYAA circle.
      </p>

      <RegisterForm />

      <div className="flex items-center gap-4 my-8">
        <div className="h-px flex-1 bg-charcoal/10" />
        <span className="text-xs text-charcoal/40 uppercase tracking-wide">or</span>
        <div className="h-px flex-1 bg-charcoal/10" />
      </div>

      <GoogleAuthButton />

      <p className="text-center text-sm text-charcoal/60 mt-8">
        Already have an account?{" "}
        <Link href="/login" className="text-burgundy hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
