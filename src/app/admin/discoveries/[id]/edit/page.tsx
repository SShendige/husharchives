import React from "react";
import prisma from "@/lib/prisma";
import DiscoveryForm from "@/components/admin/DiscoveryForm";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface EditDiscoveryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDiscoveryPage(props: EditDiscoveryPageProps) {
  const params = await props.params;
  const [discovery, categories] = await Promise.all([
    prisma.discovery.findUnique({
      where: { id: params.id },
    }),
    prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!discovery) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-mono text-discovery-orange uppercase tracking-wider font-semibold">
          MODIFY ARCHIVAL RECORD • {discovery.archiveNumber}
        </span>
        <h1
          className="text-2xl sm:text-3xl font-bold text-deep-archive font-display"
          style={{
            fontFamily:
              "'Bahnschrift', 'Bahnschrift SemiBold', 'DIN Alternate', sans-serif",
          }}
        >
          Edit Discovery
        </h1>
        <p className="text-xs sm:text-sm text-deep-archive/70 font-sans mt-0.5">
          Update the metadata, curatorial notes, or publication state of this record.
        </p>
      </div>

      <DiscoveryForm
        categories={categories}
        initialData={{
          id: discovery.id,
          archiveNumber: discovery.archiveNumber,
          title: discovery.title,
          slug: discovery.slug,
          shortDescription: discovery.shortDescription,
          fullDescription: discovery.fullDescription,
          whyInteresting: discovery.whyInteresting,
          whatToExplore: discovery.whatToExplore,
          websiteUrl: discovery.websiteUrl,
          imageUrl: discovery.imageUrl,
          categoryId: discovery.categoryId,
          tags: discovery.tags,
          isFeatured: discovery.isFeatured,
          status: discovery.status,
        }}
      />
    </div>
  );
}
