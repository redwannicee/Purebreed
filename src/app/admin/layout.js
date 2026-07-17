"use client";

import { usePathname } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) return children;

  return (
    <ProtectedRoute>
      <div className="flex min-h-[calc(100vh-5rem)] flex-col md:flex-row">
        <AdminSidebar />
        <div className="flex-1 bg-sage-50 p-4 md:p-8">{children}</div>
      </div>
    </ProtectedRoute>
  );
}
