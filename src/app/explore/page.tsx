import React from "react";
import prisma from "@/lib/prisma";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DiscoveryCard from "@/components/cards/DiscoveryCard";
import FilterBar from "@/components/explore/FilterBar";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Inbox, Compass } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Archive",
  description: "Search and browse curated internet curiosities, interactive experiments, and hidden corners of the web.",
};

interface ExplorePageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    sort?: string;
    featured?: string;
    page?: string;
  }>;
}

const PAGE_SIZE = 9;

export default async function ExplorePage(props: ExplorePageProps) {
  const searchParams = await props.searchParams;
  const q = searchParams.q?.trim() || "";
  const categorySlug = searchParams.category?.trim() || "";
  const sort = searchParams.sort || "newest";
  const isFeatured = searchParams.featured === "true";
  const page = Math.max(1, parseInt(searchParams.page || "1", 10));

  // Build Prisma where clause
  const where: Prisma.DiscoveryWhereInput = {
    status: "PUBLISHED",
  };

  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { shortDescription: { contains: q, mode: "insensitive" } },
      { fullDescription: { contains: q, mode: "insensitive" } },
      { tags: { has: q } },
    ];
  }

  if (categorySlug && categorySlug !== "all") {
    where.category = {
      slug: categorySlug,
    };
  }

  if (isFeatured) {
    where.isFeatured = true;
  }

  // Determine sorting
  let orderBy: Prisma.DiscoveryOrderByWithRelationInput = { createdAt: "desc" };
  if (sort === "oldest") {
    orderBy = { createdAt: "asc" };
  } else if (sort === "title") {
    orderBy = { title: "asc" };
  }

  // Fetch total count and paginated items in parallel
  const [totalCount, discoveries, categories] = await Promise.all([
    prisma.discovery.count({ where }),
    prisma.discovery.findMany({
      where,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        category: {
          select: { name: true, slug: true },
        },
      },
    }),
    prisma.category.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;

  // Helper for pagination links
  const createPageLink = (targetPage: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (categorySlug) params.set("category", categorySlug);
    if (sort !== "newest") params.set("sort", sort);
    if (isFeatured) params.set("featured", "true");
    params.set("page", targetPage.toString());
    return `/explore?${params.toString()}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-cold-paper">
      <Header />

      <main className="flex-1 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header title & description */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-archive-indigo font-semibold uppercase tracking-wider">
              <Compass className="w-4 h-4 text-discovery-orange" />
              <span>ARCHIVE CATALOGUE</span>
            </div>
            <h1
              className="text-3xl sm:text-4xl font-bold text-deep-archive font-display"
              style={{
                fontFamily:
                  "'Bahnschrift', 'Bahnschrift SemiBold', 'DIN Alternate', sans-serif",
              }}
            >
              Explore Discoveries
            </h1>
            <p className="text-sm sm:text-base text-deep-archive/80 max-w-2xl font-sans">
              Search, filter and inspect curious digital artifacts preserved in the catalog. Every file represents an independent creation or unique corner of cyberspace.
            </p>
          </div>

          {/* Filter Bar */}
          <FilterBar
            categories={categories}
            currentQuery={q}
            currentCategory={categorySlug}
            currentSort={sort}
            currentFeatured={isFeatured}
          />

          {/* Results count header */}
          <div className="flex items-center justify-between text-xs font-mono text-archive-indigo pt-2">
            <span>
              DISPLAYING {discoveries.length} OF {totalCount} ARCHIVED ENTRIES
            </span>
            {totalPages > 1 && (
              <span>
                PAGE {page} OF {totalPages}
              </span>
            )}
          </div>

          {/* Grid of discoveries */}
          {discoveries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {discoveries.map((discovery) => (
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
          ) : (
            /* Empty state */
            <div className="py-20 text-center bg-white rounded-lg border border-dusty-violet/25 p-8 space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-archive-paper/50 flex items-center justify-center text-deep-archive">
                <Inbox className="w-6 h-6" />
              </div>
              <h3 className="font-display font-semibold text-lg text-deep-archive">
                No matching archival entries found
              </h3>
              <p className="text-sm text-deep-archive/75 max-w-md mx-auto font-sans">
                We could not find any curiosities matching your search criteria. Try loosening your keywords or clearing selected filters.
              </p>
              <Link
                href="/explore"
                className="inline-block mt-2 px-4 py-2 rounded bg-deep-archive text-cold-paper text-xs font-mono font-medium hover:bg-archive-indigo transition"
              >
                Clear all filters
              </Link>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pt-8 flex items-center justify-center gap-2 font-mono text-xs">
              {page > 1 ? (
                <Link
                  href={createPageLink(page - 1)}
                  className="px-3 py-2 rounded border border-dusty-violet/30 bg-white hover:bg-archive-paper/30 text-deep-archive flex items-center gap-1 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </Link>
              ) : (
                <span className="px-3 py-2 rounded border border-dusty-violet/15 text-dusty-violet/50 flex items-center gap-1 cursor-not-allowed">
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </span>
              )}

              <div className="flex items-center gap-1 px-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                  const isCurrent = p === page;
                  return (
                    <Link
                      key={p}
                      href={createPageLink(p)}
                      className={`w-8 h-8 rounded flex items-center justify-center transition ${
                        isCurrent
                          ? "bg-deep-archive text-cold-paper font-bold"
                          : "bg-white border border-dusty-violet/30 hover:bg-archive-paper/30 text-deep-archive"
                      }`}
                    >
                      {p}
                    </Link>
                  );
                })}
              </div>

              {page < totalPages ? (
                <Link
                  href={createPageLink(page + 1)}
                  className="px-3 py-2 rounded border border-dusty-violet/30 bg-white hover:bg-archive-paper/30 text-deep-archive flex items-center gap-1 transition"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <span className="px-3 py-2 rounded border border-dusty-violet/15 text-dusty-violet/50 flex items-center gap-1 cursor-not-allowed">
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
