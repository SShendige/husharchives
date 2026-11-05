"use client";

import React, { useState, useTransition } from "react";
import { changeAdminPasswordAction } from "@/actions/authActions";
import { Lock, CheckCircle, AlertCircle, Loader2, KeyRound } from "lucide-react";

export default function AdminSettingsPage() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = (formData: FormData) => {
    setResult(null);
    startTransition(async () => {
      const res = await changeAdminPasswordAction(null, formData);
      if (res.success) {
        setResult({ success: true, message: "Password changed successfully." });
        // Reset the form
        const form = document.getElementById("change-password-form") as HTMLFormElement | null;
        form?.reset();
      } else {
        setResult({ success: false, message: res.error || "An error occurred." });
      }
    });
  };

  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <KeyRound className="w-5 h-5 text-discovery-orange" />
          <h1
            className="text-xl font-bold text-deep-archive"
            style={{
              fontFamily: "'Bahnschrift', 'Bahnschrift SemiBold', 'DIN Alternate', sans-serif",
            }}
          >
            Account Settings
          </h1>
        </div>
        <p className="text-xs font-mono text-dusty-violet">
          ADMINISTRATOR SECURITY SETTINGS
        </p>
      </div>

      <div className="bg-white border border-dusty-violet/30 rounded-xl p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-deep-archive font-mono uppercase tracking-wider mb-4 pb-3 border-b border-dusty-violet/20">
          Change Password
        </h2>

        {result && (
          <div
            className={`mb-4 p-3 rounded flex items-center gap-2 text-xs font-mono ${
              result.success
                ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                : "bg-rose-50 border border-rose-200 text-rose-800"
            }`}
          >
            {result.success ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{result.message}</span>
          </div>
        )}

        <form id="change-password-form" action={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="currentPassword"
              className="block text-xs font-mono font-medium text-deep-archive mb-1 uppercase tracking-wider"
            >
              Current Password
            </label>
            <div className="relative">
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm font-mono rounded bg-cold-paper border border-dusty-violet/30 text-deep-archive focus:outline-none focus:border-deep-archive focus:ring-1 focus:ring-deep-archive"
              />
              <Lock className="w-4 h-4 text-dusty-violet absolute left-3 top-2.5 pointer-events-none" />
            </div>
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="block text-xs font-mono font-medium text-deep-archive mb-1 uppercase tracking-wider"
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={10}
                placeholder="Minimum 10 characters"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm font-mono rounded bg-cold-paper border border-dusty-violet/30 text-deep-archive focus:outline-none focus:border-deep-archive focus:ring-1 focus:ring-deep-archive"
              />
              <Lock className="w-4 h-4 text-dusty-violet absolute left-3 top-2.5 pointer-events-none" />
            </div>
            <p className="mt-1 text-[11px] font-mono text-dusty-violet">
              Must be at least 10 characters long.
            </p>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-mono font-medium text-deep-archive mb-1 uppercase tracking-wider"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                placeholder="Repeat new password"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm font-mono rounded bg-cold-paper border border-dusty-violet/30 text-deep-archive focus:outline-none focus:border-deep-archive focus:ring-1 focus:ring-deep-archive"
              />
              <Lock className="w-4 h-4 text-dusty-violet absolute left-3 top-2.5 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2.5 px-4 rounded bg-deep-archive hover:bg-archive-indigo text-cold-paper font-mono text-xs font-semibold tracking-wider transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>UPDATING PASSWORD...</span>
              </>
            ) : (
              <span>CHANGE PASSWORD</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

