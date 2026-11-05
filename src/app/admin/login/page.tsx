"use client";

import React, { useState, useTransition } from "react";
import { loginAction } from "@/actions/authActions";
import { HAMonogram } from "@/components/brand/Logo";
import Link from "next/link";
import { Lock, Mail, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("from") || "/admin";
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    setErrorMessage("");
    startTransition(async () => {
      formData.set("redirectTo", redirectTo);
      const res = await loginAction(null, formData);
      if (res && !res.success) {
        setErrorMessage(res.error || "Authentication failed.");
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-cold-paper archive-grid-bg">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <HAMonogram size={48} color="#363062" accentColor="#DC552C" />
        </div>
        <h2
          className="mt-4 text-center text-2xl sm:text-3xl font-bold tracking-tight text-deep-archive font-display"
          style={{
            fontFamily:
              "'Bahnschrift', 'Bahnschrift SemiBold', 'DIN Alternate', sans-serif",
          }}
        >
          Administrative Access
        </h2>
        <p className="mt-1 text-center text-xs font-mono text-dusty-violet">
          RESTRICTED PROTOCOL • HUSH ARCHIVE VAULT
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-sm border border-dusty-violet/30 rounded-xl sm:px-10 space-y-6">
          {errorMessage && (
            <div className="p-3 rounded bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form action={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-mono font-medium text-deep-archive mb-1 uppercase tracking-wider"
              >
                Curator Identity (Email)
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="admin@husharchive.com"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm font-mono rounded bg-cold-paper border border-dusty-violet/30 text-deep-archive focus:outline-none focus:border-deep-archive focus:ring-1 focus:ring-deep-archive"
                />
                <Mail className="w-4 h-4 text-dusty-violet absolute left-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-mono font-medium text-deep-archive mb-1 uppercase tracking-wider"
              >
                Passkey
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••••••"
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
                  <span>AUTHENTICATING...</span>
                </>
              ) : (
                <span>ENTER ARCHIVE VAULT</span>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-dusty-violet/20 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs font-mono text-archive-indigo hover:text-discovery-orange transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to public catalogue</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
