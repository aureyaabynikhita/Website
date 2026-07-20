"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { registerWithEmail } from "@/services/auth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function RegisterForm() {
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(data: RegisterInput) {
    setAuthError(null);
    try {
      await registerWithEmail(data.email, data.password, data.displayName);
      router.push("/account");
    } catch {
      setAuthError("Couldn't create your account. That email may already be in use.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        id="displayName"
        label="Full Name"
        placeholder="Ananya Sharma"
        error={errors.displayName?.message}
        {...register("displayName")}
      />
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
      <Input
        id="confirmPassword"
        type="password"
        label="Confirm Password"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />
      {authError && <p className="text-xs text-error">{authError}</p>}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  );
}
