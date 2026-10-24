"use client";

import { useState } from "react";
import { toast } from "sonner";
import { reviewBusinessVerification, toggleAccountActive } from "@/app/admin/users/actions";

type Props = {
  userId: string;
  userName: string | null;
  isActive: boolean;
  businessId?: string | null;
  companyName?: string | null;
  verificationStatus?: string | null;
};

export default function AccountReviewActions(props: Props) {
  const [loading, setLoading] = useState(false);

  async function run(action: () => Promise<unknown>, message: string) {
    try {
      setLoading(true);
      await action();
      toast.success(message);
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Action failed.");
    } finally {
      setLoading(false);
    }
  }

  async function rejectBusiness() {
    const reason = window.prompt(`Reason for rejecting ${props.companyName ?? "this business"}?`);
    if (reason === null) return;
    if (!reason.trim()) {
      toast.error("A rejection reason is required.");
      return;
    }
    await run(
      () => reviewBusinessVerification(props.businessId!, "REJECTED", reason),
      "Business verification rejected.",
    );
  }

  return (
    <div className="flex min-w-48 flex-wrap gap-2">
      {props.businessId && props.verificationStatus !== "VERIFIED" && (
        <>
          <button disabled={loading} onClick={() => run(
            () => reviewBusinessVerification(props.businessId!, "VERIFIED"),
            "Business verified successfully.",
          )} className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 disabled:opacity-50">
            Verify
          </button>
          <button disabled={loading} onClick={rejectBusiness} className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 disabled:opacity-50">
            Reject
          </button>
        </>
      )}

      {props.businessId && props.verificationStatus === "VERIFIED" && (
        <span className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
          Verified
        </span>
      )}

      <button disabled={loading} onClick={() => run(
        () => toggleAccountActive(props.userId),
        props.isActive ? "Account deactivated." : "Account activated.",
      )} className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 disabled:opacity-50">
        {props.isActive ? "Deactivate" : "Activate"}
      </button>
    </div>
  );
}
