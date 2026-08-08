"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailLoginSchema, type EmailLoginInput } from "@/lib/validations/auth";
import { signInWithEmail, sendPasswordReset } from "@/services/auth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "react-hot-toast";

export function EmailLoginForm() {
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EmailLoginInput>({ resolver: zodResolver(emailLoginSchema) });

  const emailVal = watch("email");

  async function onSubmit(data: EmailLoginInput) {
    setAuthError(null);
    try {
      await signInWithEmail(data.email, data.password);
      router.push("/account");
    } catch {
      setAuthError("Incorrect email or password.");
    }
  }

  async function handleForgotPassword() {
    if (!emailVal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      toast.error("Please enter a valid email address first.");
      return;
    }
    try {
      await sendPasswordReset(emailVal);
      toast.success("Password reset email sent! Check your inbox.");
    } catch (err: any) {
      toast.error(err.message || "Failed to send reset email.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        id="email"
        type="email"
        label="Email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register("email")}
      />
      <div className="relative">
        <Input
          id="password"
          type="password"
          label="Password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />
        <button
          type="button"
          onClick={handleForgotPassword}
          className="absolute right-0 top-0 text-[10px] text-burgundy hover:underline tracking-wider font-semibold uppercase"
        >
          Forgot?
        </button>
      </div>
      {authError && <p className="text-xs text-error">{authError}</p>}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}
