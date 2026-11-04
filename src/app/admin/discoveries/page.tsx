import React from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import DiscoveriesTable from "@/components/admin/DiscoveriesTable";
import { Plus, Compass, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDiscoveriesPage() {
  const [discoveries, categories] = await Promise.all([
    prisma.discovery.findMany({
      include: {
        category: {
          select: { name: true, slug: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dusty-violet/20 pb-5">
        <div>
          <span className="text-xs font-mono text-discovery-orange uppercase tracking-wider font-semibold">
            CATALOGUE MANAGEMENT
          </span>
          <h1
            className="text-2xl sm:text-3xl font-bold text-deep-archive font-display"
            style={{
              fontFamily:
                "'Bahnschrift', 'Bahnschrift SemiBold', 'DIN Alternate', sans-serif",
            }}
          >
            Discoveries Repository
          </h1>
          <p className="text-xs sm:text-sm text-deep-archive/70 font-sans mt-0.5">
            Manage, review, publish, and curate archival entries across all cabinets.
          </p>
        </div>

        <Link
          href="/admin/discoveries/new"
          className="px-4 py-2.5 rounded bg-deep-archive hover:bg-archive-indigo text-cold-paper font-mono text-xs font-semibold tracking-wider transition flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-discovery-orange" />
          <span>ACCESSION NEW DISCOVERY</span>
        </Link>
      </div>

      {/* Interactive Table Component */}
      <DiscoveriesTable
        initialDiscoveries={discoveries}
        categories={categories}
      />
    </div>
  );
}
