"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailLoginSchema, type EmailLoginInput } from "@/lib/validations/auth";
import { signInWithEmail } from "@/services/auth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function EmailLoginForm() {
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailLoginInput>({ resolver: zodResolver(emailLoginSchema) });

  async function onSubmit(data: EmailLoginInput) {
    setAuthError(null);
    try {
      await signInWithEmail(data.email, data.password);
      router.push("/account");
    } catch {
      setAuthError("Incorrect email or password.");
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
      <Input
        id="password"
        type="password"
        label="Password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register("password")}
      />
      {authError && <p className="text-xs text-error">{authError}</p>}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}
