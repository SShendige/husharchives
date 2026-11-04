import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FolderGit2, ArrowRight } from "lucide-react";

export interface CategoryCardProps {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string | null;
  discoveryCount?: number;
}

export function CategoryCard({
  name,
  slug,
  description,
  imageUrl,
  discoveryCount = 0,
}: CategoryCardProps) {
  return (
    <Link
      href={`/explore?category=${slug}`}
      className="group relative flex flex-col justify-between p-6 rounded-lg bg-archive-paper/30 hover:bg-archive-paper/60 border border-dusty-violet/25 hover:border-deep-archive transition-all duration-200 overflow-hidden"
    >
      {/* Background illustration / texture if provided */}
      {imageUrl && (
        <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="300px"
            className="object-cover"
          />
        </div>
      )}

      <div className="relative z-10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="p-2 rounded bg-deep-archive text-cold-paper group-hover:bg-discovery-orange transition-colors">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-white/80 border border-dusty-violet/20 text-deep-archive">
            {discoveryCount} {discoveryCount === 1 ? "FILE" : "FILES"}
          </span>
        </div>

        <div>
          <h3 className="font-display font-semibold text-lg text-deep-archive group-hover:text-discovery-orange transition-colors">
            {name}
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-deep-archive/75 leading-relaxed font-sans line-clamp-3">
            {description}
          </p>
        </div>
      </div>

      <div className="relative z-10 pt-4 mt-4 border-t border-dusty-violet/20 flex items-center justify-between text-xs font-mono text-archive-indigo font-medium">
        <span>EXPLORE CABINET</span>
        <ArrowRight className="w-4 h-4 text-discovery-orange group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}

export default CategoryCard;
