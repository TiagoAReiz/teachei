import { type ReactNode } from "react";
import { AuthGuard } from "@/components/auth";
import { MainLayout } from "@/components/layout";

export default function PrivateLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <MainLayout>{children}</MainLayout>
    </AuthGuard>
  );
}
