import React from "react";
import prisma from "@/lib/prisma";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DiscoveryCard from "@/components/cards/DiscoveryCard";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ExternalLink,
  Calendar,
  Tag,
  ArrowLeft,
  Sparkles,
  Compass,
  CheckCircle,
  HelpCircle,
  FolderGit2,
} from "lucide-react";
import type { Metadata } from "next";

interface DiscoveryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(
  props: DiscoveryPageProps
): Promise<Metadata> {
  const params = await props.params;
  const discovery = await prisma.discovery.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  });

  if (!discovery) {
    return {
      title: "Discovery Not Found",
    };
  }

  return {
    title: `${discovery.title} (${discovery.archiveNumber})`,
    description: discovery.shortDescription,
    openGraph: {
      title: `${discovery.title} | HUSH ARCHIVE`,
      description: discovery.shortDescription,
      images: [
        {
          url: discovery.imageUrl,
          width: 1200,
          height: 630,
          alt: discovery.title,
        },
      ],
    },
  };
}

export default async function DiscoveryDetailsPage(props: DiscoveryPageProps) {
  const params = await props.params;
  const discovery = await prisma.discovery.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
    },
  });

  // Only published discoveries are accessible publicly
  if (!discovery || discovery.status !== "PUBLISHED") {
    notFound();
  }

  // Fetch related discoveries from the same category
  const relatedDiscoveries = await prisma.discovery.findMany({
    where: {
      categoryId: discovery.categoryId,
      id: { not: discovery.id },
      status: "PUBLISHED",
    },
    include: {
      category: {
        select: { name: true, slug: true },
      },
    },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  const formattedDate = new Date(discovery.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <div className="min-h-screen flex flex-col bg-cold-paper">
      <Header />

      <main className="flex-1 py-10 lg:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Breadcrumb / Back button */}
          <div className="flex items-center justify-between text-xs font-mono">
            <Link
              href="/explore"
              className="inline-flex items-center gap-1.5 text-archive-indigo hover:text-discovery-orange transition py-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>RETURN TO INDEX</span>
            </Link>

            <span className="text-dusty-violet">
              ARCHIVE RECORD: {discovery.archiveNumber}
            </span>
          </div>

          {/* Document Header & Title */}
          <header className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded bg-deep-archive text-cold-paper">
                {discovery.archiveNumber}
              </span>

              <Link
                href={`/explore?category=${discovery.category.slug}`}
                className="font-mono text-xs font-medium uppercase px-2.5 py-1 rounded bg-archive-paper/60 hover:bg-archive-paper text-deep-archive border border-dusty-violet/30 transition flex items-center gap-1"
              >
                <FolderGit2 className="w-3.5 h-3.5" />
                <span>{discovery.category.name}</span>
              </Link>

              {discovery.isFeatured && (
                <span className="font-mono text-xs font-bold uppercase px-2.5 py-1 rounded bg-discovery-orange text-white flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Featured Selection</span>
                </span>
              )}
            </div>

            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-deep-archive font-display leading-tight"
              style={{
                fontFamily:
                  "'Bahnschrift', 'Bahnschrift SemiBold', 'DIN Alternate', sans-serif",
              }}
            >
              {discovery.title}
            </h1>

            <p className="text-base sm:text-lg text-deep-archive/80 max-w-3xl font-sans leading-relaxed">
              {discovery.shortDescription}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-mono text-archive-indigo border-t border-dusty-violet/20">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-dusty-violet" />
                <span>ACCESSIONED: {formattedDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-dusty-violet" />
                <span>STATUS: VERIFIED ACTIVE</span>
              </div>
            </div>
          </header>

          {/* Screenshot Preview Showcase with Direct External Link CTA */}
          <div className="space-y-4">
            <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-dusty-violet/30 shadow-lg bg-deep-archive">
              <Image
                src={discovery.imageUrl}
                alt={`Screenshot of ${discovery.title}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-lg bg-archive-paper/40 border border-dusty-violet/25">
              <div className="text-xs font-mono text-deep-archive">
                <span className="text-dusty-violet">TARGET URL: </span>
                <span className="font-medium underline break-all">
                  {discovery.websiteUrl}
                </span>
              </div>

              <a
                href={discovery.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-2.5 rounded-md bg-deep-archive hover:bg-archive-indigo text-cold-paper font-mono text-xs font-semibold tracking-wider transition flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-sm hover:shadow"
              >
                <span>OPEN OFFICIAL WEBSITE</span>
                <ExternalLink className="w-3.5 h-3.5 text-discovery-orange" />
              </a>
            </div>
          </div>

          {/* Editorial Analysis Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            {/* Main Editorial Description (2 columns) */}
            <div className="md:col-span-2 space-y-8">
              {/* Full Description */}
              <section className="space-y-3">
                <h2
                  className="text-xl font-bold text-deep-archive font-display flex items-center gap-2"
                  style={{
                    fontFamily:
                      "'Bahnschrift', 'Bahnschrift SemiBold', 'DIN Alternate', sans-serif",
                  }}
                >
                  <span>Curatorial Overview</span>
                </h2>
                <div className="prose prose-neutral max-w-none text-sm sm:text-base text-deep-archive/90 leading-relaxed font-sans space-y-4">
                  {discovery.fullDescription.split("\n\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </section>

              {/* Why We Selected It */}
              <section className="p-6 rounded-lg bg-white border border-dusty-violet/25 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-discovery-orange font-bold uppercase tracking-wider">
                  <CheckCircle className="w-4 h-4" />
                  <span>Why We Selected It</span>
                </div>
                <p className="text-sm sm:text-base text-deep-archive leading-relaxed font-sans">
                  {discovery.whyInteresting}
                </p>
              </section>

              {/* What Visitors Can Explore or Do */}
              <section className="p-6 rounded-lg bg-archive-paper/30 border border-dusty-violet/25 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-archive-indigo font-bold uppercase tracking-wider">
                  <HelpCircle className="w-4 h-4" />
                  <span>What To Explore & Experience</span>
                </div>
                <p className="text-sm sm:text-base text-deep-archive leading-relaxed font-sans">
                  {discovery.whatToExplore}
                </p>
              </section>
            </div>

            {/* Sidebar Metadata (1 column) */}
            <aside className="space-y-6">
              {/* Metadata Panel */}
              <div className="p-5 rounded-lg bg-white border border-dusty-violet/25 space-y-4 font-mono text-xs">
                <h3 className="font-bold text-deep-archive tracking-wider uppercase border-b border-dusty-violet/20 pb-2">
                  Archival Dossier
                </h3>

                <div className="space-y-3">
                  <div>
                    <span className="text-dusty-violet block">ARCHIVE NUMBER</span>
                    <span className="font-semibold text-deep-archive">
                      {discovery.archiveNumber}
                    </span>
                  </div>

                  <div>
                    <span className="text-dusty-violet block">CABINET</span>
                    <Link
                      href={`/explore?category=${discovery.category.slug}`}
                      className="font-medium text-archive-indigo hover:text-discovery-orange transition underline"
                    >
                      {discovery.category.name}
                    </Link>
                  </div>

                  <div>
                    <span className="text-dusty-violet block">RECORD CREATED</span>
                    <span className="text-deep-archive">{formattedDate}</span>
                  </div>

                  <div>
                    <span className="text-dusty-violet block">SAFETY & PROTOCOL</span>
                    <span className="text-emerald-700">Sandboxed External Link</span>
                  </div>
                </div>
              </div>

              {/* Tags Cloud */}
              {discovery.tags.length > 0 && (
                <div className="p-5 rounded-lg bg-white border border-dusty-violet/25 space-y-3 font-mono text-xs">
                  <div className="flex items-center gap-1.5 text-archive-indigo font-bold uppercase tracking-wider border-b border-dusty-violet/20 pb-2">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Catalogued Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {discovery.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/explore?q=${encodeURIComponent(tag)}`}
                        className="px-2 py-1 rounded bg-archive-paper/50 hover:bg-archive-paper text-deep-archive border border-dusty-violet/20 transition text-[11px]"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>

          {/* Related Discoveries Section */}
          {relatedDiscoveries.length > 0 && (
            <section className="pt-12 border-t border-dusty-violet/20 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-archive-indigo uppercase tracking-wider">
                    From the same cabinet
                  </span>
                  <h2
                    className="text-2xl font-bold text-deep-archive font-display"
                    style={{
                      fontFamily:
                        "'Bahnschrift', 'Bahnschrift SemiBold', 'DIN Alternate', sans-serif",
                    }}
                  >
                    Related Discoveries
                  </h2>
                </div>
                <Link
                  href={`/explore?category=${discovery.category.slug}`}
                  className="text-xs font-mono text-archive-indigo hover:text-discovery-orange transition"
                >
                  View all in {discovery.category.name} →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedDiscoveries.map((rel) => (
                  <DiscoveryCard
                    key={rel.id}
                    id={rel.id}
                    title={rel.title}
                    slug={rel.slug}
                    archiveNumber={rel.archiveNumber}
                    shortDescription={rel.shortDescription}
                    imageUrl={rel.imageUrl}
                    websiteUrl={rel.websiteUrl}
                    category={rel.category}
                    createdAt={rel.createdAt}
                    isFeatured={rel.isFeatured}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
