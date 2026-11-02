import type { UserSummary } from "./auth";

export type CoupleLinkStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "CANCELLED"
  | "UNLINKED";

export interface CoupleLink {
  id: string;
  status: CoupleLinkStatus;
  created_at: string;
  responded_at?: string | null;
  requester: UserSummary;
  partner: UserSummary;
}

export interface CoupleInvitationList {
  incoming: CoupleLink[];
  outgoing: CoupleLink[];
}

