import React from "react";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cold-paper text-deep-archive">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 rounded-full border-2 border-dusty-violet/20 border-t-discovery-orange animate-spin flex items-center justify-center" />
        <div className="font-mono text-xs tracking-widest uppercase text-archive-indigo">
          Accessing Archival Vault...
        </div>
      </div>
    </div>
  );
}
