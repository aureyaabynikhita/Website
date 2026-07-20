"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ConfirmationResult, RecaptchaVerifier } from "firebase/auth";
import { phoneSchema, otpSchema, type PhoneInput, type OtpInput } from "@/lib/validations/auth";
import { setUpRecaptcha, sendOtp, confirmOtp } from "@/services/auth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const RECAPTCHA_CONTAINER_ID = "recaptcha-container";

export function PhoneOtpForm() {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [error, setError] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const confirmationRef = useRef<ConfirmationResult | null>(null);
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);

  const phoneForm = useForm<PhoneInput>({ resolver: zodResolver(phoneSchema) });
  const otpForm = useForm<OtpInput>({ resolver: zodResolver(otpSchema) });

  async function handleSendOtp(data: PhoneInput) {
    setError(null);
    try {
      if (!recaptchaRef.current) {
        recaptchaRef.current = setUpRecaptcha(RECAPTCHA_CONTAINER_ID);
      }
      const confirmation = await sendOtp(data.phone, recaptchaRef.current);
      confirmationRef.current = confirmation;
      setPhoneNumber(data.phone);
      setStep("otp");
    } catch {
      setError("Couldn't send the code. Check the number and try again.");
    }
  }

  async function handleVerifyOtp(data: OtpInput) {
    setError(null);
    if (!confirmationRef.current) {
      setError("Session expired — please resend the code.");
      setStep("phone");
      return;
    }
    try {
      await confirmOtp(confirmationRef.current, data.otp);
      router.push("/account");
    } catch {
      setError("Incorrect or expired code.");
    }
  }

  return (
    <div>
      {step === "phone" ? (
        <form onSubmit={phoneForm.handleSubmit(handleSendOtp)} className="space-y-6">
          <Input
            id="phone"
            type="tel"
            label="Mobile Number"
            placeholder="98765 43210"
            error={phoneForm.formState.errors.phone?.message}
            {...phoneForm.register("phone")}
          />
          {error && <p className="text-xs text-error">{error}</p>}
          <Button type="submit" className="w-full" disabled={phoneForm.formState.isSubmitting}>
            {phoneForm.formState.isSubmitting ? "Sending..." : "Send OTP"}
          </Button>
        </form>
      ) : (
        <form onSubmit={otpForm.handleSubmit(handleVerifyOtp)} className="space-y-6">
          <p className="text-sm text-charcoal/60">
            Enter the 6-digit code sent to +91 {phoneNumber}
          </p>
          <Input
            id="otp"
            type="text"
            inputMode="numeric"
            label="OTP"
            placeholder="123456"
            maxLength={6}
            error={otpForm.formState.errors.otp?.message}
            {...otpForm.register("otp")}
          />
          {error && <p className="text-xs text-error">{error}</p>}
          <Button type="submit" className="w-full" disabled={otpForm.formState.isSubmitting}>
            {otpForm.formState.isSubmitting ? "Verifying..." : "Verify & Continue"}
          </Button>
          <button
            type="button"
            onClick={() => setStep("phone")}
            className="text-xs text-charcoal/50 hover:text-burgundy transition-colors"
          >
            Change number
          </button>
        </form>
      )}
      {/* Invisible reCAPTCHA anchor — required by Firebase phone auth, renders nothing visible */}
      <div id={RECAPTCHA_CONTAINER_ID} />
    </div>
  );
}
