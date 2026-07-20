"use client";

import { useState } from "react";
import { FadeIn } from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/Button";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    // TODO (Phase 6/9): POST to /api/newsletter once the route exists.
    await new Promise((r) => setTimeout(r, 600));
    setStatus("success");
  }

  return (
    <section className="section-spacing bg-burgundy">
      <div className="section-container text-center max-w-xl mx-auto">
        <FadeIn>
          <p className="eyebrow text-gold mb-3">Stay In Touch</p>
          <h2 className="font-serif text-display-sm md:text-display-md text-ivory mb-4">
            Join the AUREYAA Circle
          </h2>
          <p className="text-beige/80 mb-8">
            First access to new collections, lookbooks, and private previews.
          </p>

          {status === "success" ? (
            <p className="text-gold">Welcome to the circle — check your inbox.</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 bg-transparent border border-beige/40 px-5 py-3 text-ivory placeholder:text-beige/50 focus:border-gold focus:outline-none transition-colors"
              />
              <Button
                type="submit"
                variant="secondary"
                disabled={status === "submitting"}
                className="sm:w-auto"
              >
                {status === "submitting" ? "Joining..." : "Subscribe"}
              </Button>
            </form>
          )}
        </FadeIn>
      </div>
    </section>
  );
}
