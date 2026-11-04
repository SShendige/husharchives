import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Sparkles } from "lucide-react";

export interface DiscoveryCardProps {
  id: string;
  title: string;
  slug: string;
  archiveNumber: string;
  shortDescription: string;
  imageUrl: string;
  websiteUrl: string;
  category: {
    name: string;
    slug: string;
  };
  createdAt: Date | string;
  isFeatured?: boolean;
}

export function DiscoveryCard({
  title,
  slug,
  archiveNumber,
  shortDescription,
  imageUrl,
  category,
  createdAt,
  isFeatured = false,
}: DiscoveryCardProps) {
  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="group relative flex flex-col bg-white rounded-lg border border-dusty-violet/25 hover:border-deep-archive transition-all duration-300 hover:shadow-md overflow-hidden">
      {/* Top Media / Screenshot Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-archive-paper/40">
        <Image
          src={imageUrl}
          alt={`Screenshot preview for ${title}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-archive/60 via-transparent to-black/10 opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          {/* Archive Number Badge */}
          <span className="font-mono text-[11px] font-semibold tracking-wider px-2 py-0.5 rounded bg-deep-archive/90 text-cold-paper backdrop-blur-sm border border-white/10">
            {archiveNumber}
          </span>

          {isFeatured && (
            <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-discovery-orange text-white shadow-sm uppercase">
              <Sparkles className="w-3 h-3" />
              <span>Featured</span>
            </span>
          )}
        </div>

        {/* Category tag placed bottom-left of image */}
        <div className="absolute bottom-2.5 left-3">
          <Link
            href={`/explore?category=${category.slug}`}
            className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-white/95 text-archive-indigo hover:text-discovery-orange transition shadow-sm font-medium"
          >
            {category.name}
          </Link>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 p-5 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="font-display font-semibold text-lg text-deep-archive group-hover:text-discovery-orange transition-colors duration-150 leading-snug">
            <Link href={`/explore/${slug}`} className="focus:outline-none">
              <span className="absolute inset-0 z-10" />
              {title}
            </Link>
          </h3>
          <p className="text-xs sm:text-sm text-deep-archive/80 line-clamp-3 leading-relaxed font-sans">
            {shortDescription}
          </p>
        </div>

        {/* Card Footer Metadata */}
        <div className="pt-3 border-t border-dusty-violet/15 flex items-center justify-between text-[11px] font-mono text-archive-indigo">
          <span>{formattedDate}</span>
          <span className="inline-flex items-center gap-1 text-discovery-orange font-medium group-hover:translate-x-0.5 transition-transform">
            <span>Inspect File</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </article>
  );
}

export default DiscoveryCard;
