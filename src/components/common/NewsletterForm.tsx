"use client";

import React, { useState, useTransition } from "react";
import { subscribeNewsletterAction } from "@/actions/newsletterActions";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("idle");
    setMessage("");

    startTransition(async () => {
      const result = await subscribeNewsletterAction(email);
      if (result.success) {
        setStatus("success");
        setMessage(result.message || "Thank you for subscribing to HUSH ARCHIVE.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(result.error || "Subscription failed. Please try again.");
      }
    });
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          required
          placeholder="your.email@curiosity.net"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isPending}
          className="flex-1 px-4 py-3 rounded-md bg-cold-paper border border-dusty-violet/30 font-mono text-xs sm:text-sm text-deep-archive placeholder:text-dusty-violet/60 focus:outline-none focus:border-deep-archive focus:ring-1 focus:ring-deep-archive transition"
        />
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-3 rounded-md bg-deep-archive hover:bg-archive-indigo text-cold-paper font-mono text-xs font-semibold tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>ARCHIVING...</span>
            </>
          ) : (
            <>
              <span>DISPATCH ME</span>
              <Send className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      {status === "success" && (
        <div className="mt-3 flex items-center gap-2 text-xs font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {status === "error" && (
        <div className="mt-3 flex items-center gap-2 text-xs font-mono text-rose-800 bg-rose-50 border border-rose-200 px-3 py-2 rounded">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{message}</span>
        </div>
      )}
    </div>
  );
}

export default NewsletterForm;
