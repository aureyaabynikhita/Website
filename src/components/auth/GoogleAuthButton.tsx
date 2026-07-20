"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithGoogle } from "@/services/auth";
import { Button } from "@/components/ui/Button";

export function GoogleAuthButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      router.push("/account");
    } catch {
      setError("Google sign-in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleClick}
        disabled={isLoading}
      >
        <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.9 32.6 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.5 6 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z" />
          <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34.5 6 29.5 4 24 4c-7.6 0-14.1 4.3-17.7 10.7z" />
          <path fill="#4CAF50" d="M24 44c5.3 0 10.1-2 13.7-5.4l-6.3-5.3C29.3 35 26.8 36 24 36c-5.4 0-9.9-3.4-11.3-8.1l-6.5 5C9.9 39.6 16.4 44 24 44z" />
          <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.6-2.4 4.9-4.6 6.5l6.3 5.3C40.9 36.9 44 31 44 24c0-1.2-.1-2.3-.4-3.5z" />
        </svg>
        {isLoading ? "Signing in..." : "Continue with Google"}
      </Button>
      {error && <p className="mt-2 text-xs text-error">{error}</p>}
    </div>
  );
}
