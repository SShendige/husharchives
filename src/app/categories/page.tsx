import React from "react";
import prisma from "@/lib/prisma";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoryCard from "@/components/cards/CategoryCard";
import { Library, FolderGit2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subject Cabinets & Categories",
  description:
    "Explore the six curated discovery cabinets of HUSH ARCHIVE: Digital Experiments, Hidden Websites, Learn Something, Internet Playground, Indie Creations, and Digital Archives.",
};

export const revalidate = 60;

export default async function CategoriesPage() {
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

  const totalPublished = categories.reduce(
    (acc, cat) => acc + cat._count.discoveries,
    0
  );

  return (
    <div className="min-h-screen flex flex-col bg-cold-paper">
      <Header />

      <main className="flex-1 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Header */}
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-archive-indigo font-semibold uppercase tracking-wider">
              <Library className="w-4 h-4 text-discovery-orange" />
              <span>TAXONOMY & ARCHIVE STRUCTURE</span>
            </div>

            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-deep-archive font-display"
              style={{
                fontFamily:
                  "'Bahnschrift', 'Bahnschrift SemiBold', 'DIN Alternate', sans-serif",
              }}
            >
              Curated Cabinets
            </h1>

            <p className="text-base sm:text-lg text-deep-archive/80 font-sans leading-relaxed">
              Every digital discovery in HUSH ARCHIVE is catalogued into one of six core subject cabinets. Select any cabinet to browse its preserved entries and explore the unusual web.
            </p>

            <div className="flex items-center gap-4 text-xs font-mono text-dusty-violet pt-2">
              <span>{categories.length} CURATED CABINETS</span>
              <span>•</span>
              <span>{totalPublished} TOTAL INDEXED FILES</span>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
      </main>

      <Footer />
    </div>
  );
}
