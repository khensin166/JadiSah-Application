import { RoleGuard } from "@/components/auth/RoleGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard allow={["ADMIN", "SUPER_ADMIN"]}>{children}</RoleGuard>;
}
