"use client";

import { useCallback, useEffect, useState } from "react";
import { coupleService } from "@/lib/services/couple.service";
import { useSession } from "@/context/auth-context";
import type { CoupleInvitationList, CoupleLink } from "@/types/couple";

function toErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

export function useCouple() {
  const {
    user,
    isLoading: isSessionLoading,
    hasRole,
    refresh: refreshSession,
  } = useSession();

  const isAdmin = hasRole("ADMIN", "SUPER_ADMIN");

  const [couple, setCouple] = useState<CoupleLink | null>(null);
  const [invitations, setInvitations] = useState<CoupleInvitationList>({
    incoming: [],
    outgoing: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      if (isAdmin) {
        // Admin / Super Admin bypasses /couples/me authentication check
        // so it never triggers 404 {"message":"no active couple link"},
        // while still loading invitations for couple configuration preview.
        const pendingList = await coupleService.listInvitations();
        setCouple(null);
        setInvitations(pendingList);
      } else {
        const [activeCouple, pendingList] = await Promise.all([
          coupleService.getMyCouple(),
          coupleService.listInvitations(),
        ]);
        setCouple(activeCouple);
        setInvitations(pendingList);
      }
    } catch (err) {
      setError(toErrorMessage(err, "Gagal memuat status pasangan."));
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (isSessionLoading) return;

    let active = true;

    const loadInitial = async () => {
      if (!user) {
        if (active) setIsLoading(false);
        return;
      }

      try {
        if (isAdmin) {
          // Bypass /couples/me for ADMIN / SUPER_ADMIN
          const pendingList = await coupleService.listInvitations();
          if (active) {
            setCouple(null);
            setInvitations(pendingList);
            setIsLoading(false);
          }
        } else {
          const [activeCouple, pendingList] = await Promise.all([
            coupleService.getMyCouple(),
            coupleService.listInvitations(),
          ]);
          if (active) {
            setCouple(activeCouple);
            setInvitations(pendingList);
            setIsLoading(false);
          }
        }
      } catch (err) {
        if (active) {
          setError(toErrorMessage(err, "Gagal memuat status pasangan."));
          setIsLoading(false);
        }
      }
    };

    void loadInitial();

    return () => {
      active = false;
    };
  }, [isSessionLoading, user, isAdmin]);

  const clearFeedback = useCallback(() => {
    setError(null);
    setSuccessMsg(null);
  }, []);

  const invitePartner = useCallback(
    async (email: string): Promise<boolean> => {
      setIsMutating(true);
      setError(null);
      setSuccessMsg(null);
      try {
        await coupleService.invitePartner(email);
        await reload();
        setSuccessMsg(`Undangan berhasil dikirim ke ${email}.`);
        return true;
      } catch (err) {
        setError(
          toErrorMessage(
            err,
            "Gagal mengirim undangan. Pastikan email pasangan sudah terdaftar di JadiSah."
          )
        );
        return false;
      } finally {
        setIsMutating(false);
      }
    },
    [reload]
  );

  const acceptInvitation = useCallback(
    async (invitationId: string): Promise<boolean> => {
      setIsMutating(true);
      setError(null);
      setSuccessMsg(null);
      try {
        await coupleService.acceptInvitation(invitationId);
        await Promise.all([reload(), refreshSession()]);
        setSuccessMsg("Undangan pasangan diterima! Akun Anda kini telah terhubung.");
        return true;
      } catch (err) {
        setError(toErrorMessage(err, "Gagal menerima undangan pasangan."));
        return false;
      } finally {
        setIsMutating(false);
      }
    },
    [reload, refreshSession]
  );

  const rejectInvitation = useCallback(
    async (invitationId: string): Promise<boolean> => {
      setIsMutating(true);
      setError(null);
      setSuccessMsg(null);
      try {
        await coupleService.rejectInvitation(invitationId);
        await reload();
        setSuccessMsg("Undangan pasangan ditolak.");
        return true;
      } catch (err) {
        setError(toErrorMessage(err, "Gagal menolak undangan pasangan."));
        return false;
      } finally {
        setIsMutating(false);
      }
    },
    [reload]
  );

  const cancelInvitation = useCallback(
    async (invitationId: string): Promise<boolean> => {
      setIsMutating(true);
      setError(null);
      setSuccessMsg(null);
      try {
        await coupleService.cancelInvitation(invitationId);
        await reload();
        setSuccessMsg("Undangan pasangan berhasil dibatalkan.");
        return true;
      } catch (err) {
        setError(toErrorMessage(err, "Gagal membatalkan undangan."));
        return false;
      } finally {
        setIsMutating(false);
      }
    },
    [reload]
  );

  const unlinkCouple = useCallback(async (): Promise<boolean> => {
    setIsMutating(true);
    setError(null);
    setSuccessMsg(null);
    try {
      await coupleService.unlinkCouple();
      await Promise.all([reload(), refreshSession()]);
      setSuccessMsg("Tautan pasangan telah diputuskan.");
      return true;
    } catch (err) {
      setError(toErrorMessage(err, "Gagal memutuskan tautan pasangan."));
      return false;
    } finally {
      setIsMutating(false);
    }
  }, [reload, refreshSession]);

  return {
    couple,
    invitations,
    isAdmin,
    isLoading,
    isMutating,
    error,
    successMsg,
    clearFeedback,
    reload,
    invitePartner,
    acceptInvitation,
    rejectInvitation,
    cancelInvitation,
    unlinkCouple,
  };
}
