import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DiscoveryCard from "@/components/cards/DiscoveryCard";
import CategoryCard from "@/components/cards/CategoryCard";
import NewsletterForm from "@/components/common/NewsletterForm";
import { ArrowRight, Compass, Sparkles, BookOpen, Layers, Library } from "lucide-react";

export const revalidate = 60; // ISR cache revalidation every minute

export default async function HomePage() {
  // 1. Fetch featured discoveries
  const featuredDiscoveries = await prisma.discovery.findMany({
    where: {
      status: "PUBLISHED",
      isFeatured: true,
    },
    include: {
      category: {
        select: { name: true, slug: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  // 2. Fetch recently added discoveries
  const recentDiscoveries = await prisma.discovery.findMany({
    where: {
      status: "PUBLISHED",
    },
    include: {
      category: {
        select: { name: true, slug: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  // 3. Fetch categories with published counts
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          discoveries: {
            where: { status: "PUBLISHED" },
          },
        },
      },
    },
    orderBy: { name: "asc" },
  });

  // 4. Fetch a random discovery slug for the "Discover Something Unexpected" button
  const allPublished = await prisma.discovery.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true },
  });

  const randomSlug =
    allPublished.length > 0
      ? allPublished[Math.floor(Math.random() * allPublished.length)].slug
      : null;

  const totalCount = allPublished.length;

  return (
    <div className="min-h-screen flex flex-col bg-cold-paper">
      <Header />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden border-b border-dusty-violet/20 archive-grid-bg py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl space-y-6">
              {/* Monogram tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-archive-paper/60 border border-dusty-violet/30 text-xs font-mono text-archive-indigo font-medium">
                <span className="w-2 h-2 rounded-full bg-discovery-orange" />
                <span>INDEXING {totalCount} CURATED INTERNET ARTIFACTS</span>
              </div>

              {/* Headline */}
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-deep-archive leading-[1.1] font-display"
                style={{
                  fontFamily:
                    "'Bahnschrift', 'Bahnschrift SemiBold', 'DIN Alternate', sans-serif",
                }}
              >
                The internet is full of things worth finding.
              </h1>

              {/* Supporting Text */}
              <p className="text-base sm:text-lg text-deep-archive/85 font-sans leading-relaxed">
                HUSH ARCHIVE is a global digital discovery platform that curates unusual websites, independent digital creations, interactive experiences, browser experiments and overlooked corners of the internet.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                <Link
                  href="/explore"
                  className="px-6 py-3.5 rounded-md bg-deep-archive hover:bg-archive-indigo text-cold-paper font-mono text-xs sm:text-sm font-semibold tracking-wider transition shadow-sm hover:shadow flex items-center justify-center gap-2"
                >
                  <Compass className="w-4 h-4 text-discovery-orange" />
                  <span>EXPLORE THE ARCHIVE</span>
                </Link>

                {randomSlug && (
                  <Link
                    href={`/explore/${randomSlug}`}
                    className="px-6 py-3.5 rounded-md bg-archive-paper/60 hover:bg-archive-paper text-deep-archive border border-dusty-violet/30 font-mono text-xs sm:text-sm font-semibold tracking-wider transition flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-discovery-orange" />
                    <span>DISCOVER SOMETHING UNEXPECTED</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED DISCOVERIES */}
        {featuredDiscoveries.length > 0 && (
          <section className="py-16 sm:py-20 border-b border-dusty-violet/20 bg-white/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-discovery-orange font-semibold tracking-wider uppercase mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span>Curator’s Choice</span>
                  </div>
                  <h2
                    className="text-2xl sm:text-3xl font-bold text-deep-archive font-display"
                    style={{
                      fontFamily:
                        "'Bahnschrift', 'Bahnschrift SemiBold', 'DIN Alternate', sans-serif",
                    }}
                  >
                    Featured Discoveries
                  </h2>
                </div>
                <Link
                  href="/explore?featured=true"
                  className="text-xs font-mono text-archive-indigo hover:text-discovery-orange font-medium flex items-center gap-1 group self-start sm:self-auto"
                >
                  <span>View All Featured</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {featuredDiscoveries.map((discovery) => (
                  <DiscoveryCard
                    key={discovery.id}
                    id={discovery.id}
                    title={discovery.title}
                    slug={discovery.slug}
                    archiveNumber={discovery.archiveNumber}
                    shortDescription={discovery.shortDescription}
                    imageUrl={discovery.imageUrl}
                    websiteUrl={discovery.websiteUrl}
                    category={discovery.category}
                    createdAt={discovery.createdAt}
                    isFeatured={discovery.isFeatured}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* BROWSE BY CATEGORY */}
        <section className="py-16 sm:py-20 border-b border-dusty-violet/20 bg-cold-paper">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-archive-indigo font-semibold tracking-wider uppercase mb-1">
                  <Library className="w-4 h-4" />
                  <span>Subject Cabinets</span>
                </div>
                <h2
                  className="text-2xl sm:text-3xl font-bold text-deep-archive font-display"
                  style={{
                    fontFamily:
                      "'Bahnschrift', 'Bahnschrift SemiBold', 'DIN Alternate', sans-serif",
                  }}
                >
                  Browse by Category
                </h2>
              </div>
              <Link
                href="/categories"
                className="text-xs font-mono text-archive-indigo hover:text-discovery-orange font-medium flex items-center gap-1 group self-start sm:self-auto"
              >
                <span>View All 6 Cabinets</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  id={category.id}
                  name={category.name}
                  slug={category.slug}
                  description={category.description}
                  imageUrl={category.imageUrl}
                  discoveryCount={category._count.discoveries}
                />
              ))}
            </div>
          </div>
        </section>

        {/* RECENTLY ADDED */}
        <section className="py-16 sm:py-20 border-b border-dusty-violet/20 bg-white/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-discovery-orange font-semibold tracking-wider uppercase mb-1">
                  <span className="w-2 h-2 rounded-full bg-discovery-orange animate-pulse" />
                  <span>Fresh Accessions</span>
                </div>
                <h2
                  className="text-2xl sm:text-3xl font-bold text-deep-archive font-display"
                  style={{
                    fontFamily:
                      "'Bahnschrift', 'Bahnschrift SemiBold', 'DIN Alternate', sans-serif",
                  }}
                >
                  Recently Added
                </h2>
              </div>
              <Link
                href="/explore?sort=newest"
                className="text-xs font-mono text-archive-indigo hover:text-discovery-orange font-medium flex items-center gap-1 group self-start sm:self-auto"
              >
                <span>Browse Entire Directory</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {recentDiscoveries.map((discovery) => (
                <DiscoveryCard
                  key={discovery.id}
                  id={discovery.id}
                  title={discovery.title}
                  slug={discovery.slug}
                  archiveNumber={discovery.archiveNumber}
                  shortDescription={discovery.shortDescription}
                  imageUrl={discovery.imageUrl}
                  websiteUrl={discovery.websiteUrl}
                  category={discovery.category}
                  createdAt={discovery.createdAt}
                  isFeatured={discovery.isFeatured}
                />
              ))}
            </div>
          </div>
        </section>

        {/* NEWSLETTER BANNER */}
        <section className="py-20 bg-archive-paper/40 border-b border-dusty-violet/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-deep-archive text-cold-paper text-xs font-mono font-medium">
              <span className="w-2 h-2 rounded-full bg-discovery-orange" />
              <span>THE HUSH DISPATCH</span>
            </div>
            <h2
              className="text-3xl sm:text-4xl font-bold text-deep-archive font-display"
              style={{
                fontFamily:
                  "'Bahnschrift', 'Bahnschrift SemiBold', 'DIN Alternate', sans-serif",
              }}
            >
              Unusual internet discoveries delivered quietly.
            </h2>
            <p className="text-sm sm:text-base text-deep-archive/80 max-w-xl mx-auto font-sans leading-relaxed">
              No tracking algorithms. No influencer hype. Just carefully catalogued experiments, overlooked web portals, and generative net curiosities once a month.
            </p>
            <div className="max-w-md mx-auto pt-2">
              <NewsletterForm />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
