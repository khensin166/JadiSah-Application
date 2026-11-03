import { apiClient, ApiError } from "../api-client";
import type { CoupleInvitationList, CoupleLink } from "../../types/couple";

/**
 * Service untuk mengelola koneksi pasangan (Couple Link & Invitations).
 * Sesuai kontrak backend di `backend/internal/api/couples.go`.
 */
export const coupleService = {
  /**
   * Mengambil pasangan aktif (ACCEPTED) via `GET /api/couples/me`.
   * Mengembalikan `null` jika belum memiliki pasangan (HTTP 404).
   */
  async getMyCouple(): Promise<CoupleLink | null> {
    try {
      const res = await apiClient<CoupleLink | undefined>("/couples/me", { method: "GET" });
      return res ?? null;
    } catch (err) {
      if (err instanceof ApiError && (err.status === 404 || err.status === 401)) {
        return null;
      }
      throw err;
    }
  },

  /**
   * Mengambil daftar undangan pasangan yang masih PENDING (incoming & outgoing).
   */
  async listInvitations(): Promise<CoupleInvitationList> {
    try {
      return await apiClient<CoupleInvitationList>("/couples/invitations", {
        method: "GET",
      });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        return { incoming: [], outgoing: [] };
      }
      throw err;
    }
  },

  /**
   * Mengirim undangan pasangan berdasarkan alamat email (`POST /api/couples/invitations`).
   */
  async invitePartner(partnerEmail: string): Promise<{ message: string }> {
    return apiClient<{ message: string }>("/couples/invitations", {
      method: "POST",
      body: JSON.stringify({ partner_email: partnerEmail.trim() }),
    });
  },

  /**
   * Menerima undangan pasangan yang masuk (`POST /api/couples/invitations/{id}/accept`).
   */
  async acceptInvitation(invitationId: string): Promise<{ message: string }> {
    return apiClient<{ message: string }>(
      `/couples/invitations/${invitationId}/accept`,
      { method: "POST" }
    );
  },

  /**
   * Menolak undangan pasangan yang masuk (`POST /api/couples/invitations/{id}/reject`).
   */
  async rejectInvitation(invitationId: string): Promise<{ message: string }> {
    return apiClient<{ message: string }>(
      `/couples/invitations/${invitationId}/reject`,
      { method: "POST" }
    );
  },

  /**
   * Membatalkan undangan pasangan yang dikirim (`DELETE /api/couples/invitations/{id}`).
   */
  async cancelInvitation(invitationId: string): Promise<void> {
    await apiClient<void>(`/couples/invitations/${invitationId}`, {
      method: "DELETE",
    });
  },

  /**
   * Memutuskan tautan pasangan yang sedang aktif (`DELETE /api/couples/me`).
   */
  async unlinkCouple(): Promise<void> {
    await apiClient<void>("/couples/me", { method: "DELETE" });
  },
};

