import { UserRound, CheckCircle2 } from "lucide-react";

export default function ProfileCard() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="rounded-2xl bg-blue-50 p-3">
          <UserRound className="h-5 w-5 text-blue-600" />
        </div>

        <CheckCircle2 className="h-5 w-5 text-green-600" />
      </div>

      <p className="mt-6 text-sm text-slate-500">
        Profile Completion
      </p>

      <h2 className="mt-2 text-4xl font-black">
        82%
      </h2>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full w-[82%] rounded-full bg-blue-600" />
      </div>
    </div>
  );
}