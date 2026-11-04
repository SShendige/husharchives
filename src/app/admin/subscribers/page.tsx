import React from "react";
import prisma from "@/lib/prisma";
import { Mail, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminSubscribersPage() {
  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { subscribedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dusty-violet/20 pb-5">
        <div>
          <span className="text-xs font-mono text-discovery-orange uppercase tracking-wider font-semibold">
            AUDIENCE DISPATCH
          </span>
          <h1
            className="text-2xl sm:text-3xl font-bold text-deep-archive font-display"
            style={{
              fontFamily:
                "'Bahnschrift', 'Bahnschrift SemiBold', 'DIN Alternate', sans-serif",
            }}
          >
            Newsletter Subscribers
          </h1>
          <p className="text-xs sm:text-sm text-deep-archive/70 font-sans mt-0.5">
            Recipients subscribed to the periodic HUSH ARCHIVE curiosity dispatch.
          </p>
        </div>

        <div className="px-4 py-2 rounded bg-white border border-dusty-violet/25 font-mono text-xs text-deep-archive font-semibold shadow-sm self-start sm:self-auto">
          TOTAL SUBSCRIBERS: {subscribers.length}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-dusty-violet/25 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="bg-cold-paper/80 border-b border-dusty-violet/20 text-[11px] font-mono text-archive-indigo uppercase tracking-wider">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Subscriber Email</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Subscribed Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dusty-violet/10">
              {subscribers.length > 0 ? (
                subscribers.map((sub, index) => (
                  <tr
                    key={sub.id}
                    className="hover:bg-cold-paper/30 transition-colors font-medium text-deep-archive"
                  >
                    <td className="py-3 px-4 font-mono text-dusty-violet">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4 font-mono font-medium flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-dusty-violet" />
                      <span>{sub.email}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{sub.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-dusty-violet text-right">
                      {new Date(sub.subscribedAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-dusty-violet font-mono">
                    No newsletter subscribers registered yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
