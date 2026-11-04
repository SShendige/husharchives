"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cold-paper px-4 py-16 text-center">
      <div className="max-w-md w-full bg-white p-8 rounded-xl border border-dusty-violet/30 shadow-sm space-y-6">
        <div className="w-14 h-14 mx-auto rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-xs text-rose-700 font-bold uppercase tracking-wider">
            ARCHIVE MALFUNCTION
          </span>
          <h1
            className="text-2xl font-bold text-deep-archive font-display"
            style={{
              fontFamily:
                "'Bahnschrift', 'Bahnschrift SemiBold', 'DIN Alternate', sans-serif",
            }}
          >
            Something unexpected occurred
          </h1>
          <p className="text-xs sm:text-sm text-deep-archive/80 font-sans leading-relaxed">
            The archive query could not be completed. The repository has recorded this diagnostic.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto px-5 py-2.5 rounded bg-deep-archive hover:bg-archive-indigo text-cold-paper font-mono text-xs font-semibold tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>TRY AGAIN</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded border border-dusty-violet/30 bg-cold-paper hover:bg-archive-paper/40 text-deep-archive font-mono text-xs font-semibold tracking-wider transition flex items-center justify-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" />
            <span>RETURN HOME</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
