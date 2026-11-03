"use client";

import React, { useCallback, useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useSession } from "@/context/auth-context";
import { adminService } from "@/lib/services/admin.service";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminMetricsCards } from "@/components/admin/AdminMetricsCards";
import { UserManagementTable } from "@/components/admin/UserManagementTable";
import { EditRoleModal } from "@/components/admin/EditRoleModal";
import { EditSubscriptionModal } from "@/components/admin/EditSubscriptionModal";
import type {
  AdminUser,
  RoleName,
  SetUserSubscriptionPayload,
} from "@/types/admin";

export default function AdminPage() {
  const { user: currentAdmin } = useSession();
  const isSuperAdmin = Boolean(currentAdmin?.roles?.includes("SUPER_ADMIN"));

  // State Paginasi & Filter
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [selectedTier, setSelectedTier] = useState("ALL");

  // State Loading & Feedback
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // State Modals
  const [editingRoleUser, setEditingRoleUser] = useState<AdminUser | null>(null);
  const [editingSubUser, setEditingSubUser] = useState<AdminUser | null>(null);
  const [isSavingRole, setIsSavingRole] = useState(false);
  const [isSavingSub, setIsSavingSub] = useState(false);

  // Fetch Users from Backend API
  const fetchUsers = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    setIsRefreshing(true);
    try {
      const data = await adminService.listUsers({
        q: searchQuery,
        page,
        per_page: perPage,
      });

      // Filter sisi client jika user memilih dropdown role/tier spesifik
      let filteredItems = data.items;
      if (selectedRole !== "ALL") {
        filteredItems = filteredItems.filter((u) =>
          u.roles.includes(selectedRole as RoleName)
        );
      }
      if (selectedTier !== "ALL") {
        filteredItems = filteredItems.filter(
          (u) => u.subscription_tier === selectedTier
        );
      }

      setUsers(filteredItems);
      setTotal(selectedRole !== "ALL" || selectedTier !== "ALL" ? filteredItems.length : data.total);
    } catch (err) {
      setFeedbackMsg({
        type: "error",
        text: err instanceof Error ? err.message : "Gagal memuat direktori pengguna.",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [searchQuery, page, perPage, selectedRole, selectedTier]);

  // Efek memuat data saat dependensi berubah dengan debouncing pencarian
  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchUsers();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  // Handler Simpan Role
  const handleSaveRoles = async (userId: string, newRoles: RoleName[]): Promise<boolean> => {
    setIsSavingRole(true);
    setFeedbackMsg(null);
    try {
      const updated = await adminService.setUserRoles(userId, { roles: newRoles });
      setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
      setFeedbackMsg({
        type: "success",
        text: `Hak akses peran untuk ${updated.email} berhasil diperbarui.`,
      });
      return true;
    } catch (err) {
      setFeedbackMsg({
        type: "error",
        text: err instanceof Error ? err.message : "Gagal memperbarui peran pengguna.",
      });
      return false;
    } finally {
      setIsSavingRole(false);
    }
  };

  // Handler Simpan Subscription
  const handleSaveSubscription = async (
    userId: string,
    payload: SetUserSubscriptionPayload
  ): Promise<boolean> => {
    setIsSavingSub(true);
    setFeedbackMsg(null);
    try {
      const updated = await adminService.setUserSubscription(userId, payload);
      setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
      setFeedbackMsg({
        type: "success",
        text: `Paket langganan untuk ${updated.email} berhasil diubah ke ${updated.subscription_tier}.`,
      });
      return true;
    } catch (err) {
      setFeedbackMsg({
        type: "error",
        text: err instanceof Error ? err.message : "Gagal memperbarui paket langganan.",
      });
      return false;
    } finally {
      setIsSavingSub(false);
    }
  };

  return (
    <SidebarProvider
      style={{ "--sidebar-width": "18rem", "--sidebar-width-icon": "4rem" } as React.CSSProperties}
      className="flex min-h-screen bg-ivory-100 font-sans text-charcoal-800 antialiased selection:bg-champagne-light selection:text-charcoal-900"
    >
      {/* 1. Left Sidebar Navigation */}
      <AdminSidebar
        adminUser={currentAdmin}
        activeSection="users"
        onSectionChange={() => {}}
        totalUsersCount={total}
      />

      {/* 2. Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        <AdminHeader
          onRefresh={() => void fetchUsers(true)}
          isRefreshing={isRefreshing}
        />

        <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Feedback Banner */}
          {feedbackMsg && (
            <div
              className={`rounded-2xl border px-4 py-3.5 text-xs font-medium soft-shadow animate-in fade-in duration-200 flex items-center justify-between ${
                feedbackMsg.type === "success"
                  ? "border-sage/40 bg-sage-soft text-sage-dark"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              <span>{feedbackMsg.text}</span>
              <button
                type="button"
                onClick={() => setFeedbackMsg(null)}
                className="text-xs font-bold hover:underline ml-3"
              >
                Tutup
              </button>
            </div>
          )}

          {/* Quick Metrics Summary */}
          <AdminMetricsCards totalUsers={total} usersOnPage={users} />

          {/* User Management Table */}
          <UserManagementTable
            users={users}
            total={total}
            page={page}
            perPage={perPage}
            searchQuery={searchQuery}
            onSearchChange={(q) => {
              setSearchQuery(q);
              setPage(1);
            }}
            selectedRole={selectedRole}
            onRoleFilterChange={(r) => {
              setSelectedRole(r);
              setPage(1);
            }}
            selectedTier={selectedTier}
            onTierFilterChange={(t) => {
              setSelectedTier(t);
              setPage(1);
            }}
            onPageChange={setPage}
            isLoading={isLoading}
            isSuperAdmin={isSuperAdmin}
            onEditRoles={(u) => setEditingRoleUser(u)}
            onEditSubscription={(u) => setEditingSubUser(u)}
          />
        </main>

        {/* Footer */}
        <footer className="mt-auto border-t border-champagne-light/50 bg-ivory-50/70 py-6 px-4 sm:px-8 text-xs text-charcoal-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold tracking-wider text-charcoal-900">JADISAH</span>
            <span>&bull; Atelier Authority Administration Console</span>
          </div>
          <div>
            <span>Protected with Role-Based Access Control (RBAC)</span>
          </div>
        </footer>
      </div>

      {/* 3. Modals */}
      <EditRoleModal
        open={Boolean(editingRoleUser)}
        onClose={() => setEditingRoleUser(null)}
        targetUser={editingRoleUser}
        currentAdminId={currentAdmin?.id}
        onSave={handleSaveRoles}
        isSaving={isSavingRole}
      />

      <EditSubscriptionModal
        open={Boolean(editingSubUser)}
        onClose={() => setEditingSubUser(null)}
        targetUser={editingSubUser}
        onSave={handleSaveSubscription}
        isSaving={isSavingSub}
      />
    </SidebarProvider>
  );
}
