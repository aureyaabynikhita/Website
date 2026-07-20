"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { EmailLoginForm } from "@/components/auth/EmailLoginForm";
import { PhoneOtpForm } from "@/components/auth/PhoneOtpForm";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";

type LoginTab = "email" | "phone";

export default function LoginPage() {
  const [tab, setTab] = useState<LoginTab>("email");

  return (
    <div>
      <h1 className="font-serif text-display-sm text-center text-charcoal mb-2">Sign In</h1>
      <p className="text-center text-sm text-charcoal/60 mb-8">
        Welcome back to AUREYAA.
      </p>

      <div className="flex border-b border-charcoal/10 mb-8">
        {(["email", "phone"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 pb-3 text-xs tracking-[0.12em] uppercase transition-colors",
              tab === t ? "text-burgundy border-b-2 border-burgundy" : "text-charcoal/50"
            )}
          >
            {t === "email" ? "Email" : "Mobile OTP"}
          </button>
        ))}
      </div>

      {tab === "email" ? <EmailLoginForm /> : <PhoneOtpForm />}

      <div className="flex items-center gap-4 my-8">
        <div className="h-px flex-1 bg-charcoal/10" />
        <span className="text-xs text-charcoal/40 uppercase tracking-wide">or</span>
        <div className="h-px flex-1 bg-charcoal/10" />
      </div>

      <GoogleAuthButton />

      <p className="text-center text-sm text-charcoal/60 mt-8">
        New to AUREYAA?{" "}
        <Link href="/register" className="text-burgundy hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
