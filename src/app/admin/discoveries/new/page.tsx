import React from "react";
import prisma from "@/lib/prisma";
import DiscoveryForm from "@/components/admin/DiscoveryForm";
import { getNextArchiveNumber } from "@/actions/discoveryActions";

export const dynamic = "force-dynamic";

export default async function NewDiscoveryPage() {
  const [categories, nextArchiveNumber] = await Promise.all([
    prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    getNextArchiveNumber(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-mono text-discovery-orange uppercase tracking-wider font-semibold">
          NEW ARCHIVAL RECORD
        </span>
        <h1
          className="text-2xl sm:text-3xl font-bold text-deep-archive font-display"
          style={{
            fontFamily:
              "'Bahnschrift', 'Bahnschrift SemiBold', 'DIN Alternate', sans-serif",
          }}
        >
          Accession Discovery
        </h1>
        <p className="text-xs sm:text-sm text-deep-archive/70 font-sans mt-0.5">
          Catalogue a new curious website, interactive experiment, or overlooked corner of cyberspace.
        </p>
      </div>

      <DiscoveryForm
        categories={categories}
        suggestedArchiveNumber={nextArchiveNumber}
      />
    </div>
  );
}
