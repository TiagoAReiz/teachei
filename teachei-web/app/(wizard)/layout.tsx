import { type ReactNode } from "react";
import { AuthGuard } from "@/components/auth";

export default function WizardLayout({ children }: { children: ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
