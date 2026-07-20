"use client";

import type { ReactNode } from "react";
import { useAuthListener } from "@/hooks/useAuth";

export function AuthProvider({ children }: { children: ReactNode }) {
  useAuthListener();
  return <>{children}</>;
}
