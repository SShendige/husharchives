"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  createDiscoveryAction,
  updateDiscoveryAction,
} from "@/actions/discoveryActions";
import { slugify } from "@/lib/validations";
import {
  Save,
  ArrowLeft,
  Sparkles,
  Link as LinkIcon,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

interface CategoryOption {
  id: string;
  name: string;
}

interface DiscoveryFormProps {
  categories: CategoryOption[];
  initialData?: {
    id: string;
    archiveNumber: string;
    title: string;
    slug: string;
    shortDescription: string;
    fullDescription: string;
    whyInteresting: string;
    whatToExplore: string;
    websiteUrl: string;
    imageUrl: string;
    categoryId: string;
    tags: string[];
    isFeatured: boolean;
    status: "DRAFT" | "PUBLISHED";
  };
  suggestedArchiveNumber?: string;
}

export function DiscoveryForm({
  categories,
  initialData,
  suggestedArchiveNumber = "FILE 0001",
}: DiscoveryFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialData);

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [autoSlug, setAutoSlug] = useState(!initialData);
  const [shortDescription, setShortDescription] = useState(
    initialData?.shortDescription || ""
  );
  const [fullDescription, setFullDescription] = useState(
    initialData?.fullDescription || ""
  );
  const [whyInteresting, setWhyInteresting] = useState(
    initialData?.whyInteresting || ""
  );
  const [whatToExplore, setWhatToExplore] = useState(
    initialData?.whatToExplore || ""
  );
  const [websiteUrl, setWebsiteUrl] = useState(initialData?.websiteUrl || "");
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
  const [categoryId, setCategoryId] = useState(
    initialData?.categoryId || categories[0]?.id || ""
  );
  const [tags, setTags] = useState(initialData?.tags.join(", ") || "");
  const [isFeatured, setIsFeatured] = useState(
    initialData?.isFeatured || false
  );
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">(
    initialData?.status || "DRAFT"
  );

  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (autoSlug) {
      setSlug(slugify(val));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("shortDescription", shortDescription);
    formData.append("fullDescription", fullDescription);
    formData.append("whyInteresting", whyInteresting);
    formData.append("whatToExplore", whatToExplore);
    formData.append("websiteUrl", websiteUrl);
    formData.append("imageUrl", imageUrl);
    formData.append("categoryId", categoryId);
    formData.append("tags", tags);
    formData.append("isFeatured", isFeatured ? "true" : "false");
    formData.append("status", status);

    startTransition(async () => {
      const res =
        isEditing && initialData
          ? await updateDiscoveryAction(initialData.id, formData)
          : await createDiscoveryAction(formData);

      if (res.success) {
        router.push("/admin/discoveries");
        router.refresh();
      } else {
        setErrorMessage(res.error || "Operation failed.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {/* Top action header */}
      <div className="flex items-center justify-between border-b border-dusty-violet/20 pb-4">
        <Link
          href="/admin/discoveries"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-archive-indigo hover:text-discovery-orange transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Discoveries</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={isPending}
            className="px-5 py-2 rounded bg-deep-archive hover:bg-archive-indigo text-cold-paper font-mono text-xs font-semibold tracking-wider transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-sm"
          >
            {isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>SAVING RECORD...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 text-discovery-orange" />
                <span>{isEditing ? "UPDATE DISCOVERY" : "SAVE TO ARCHIVE"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Form Fields */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-dusty-violet/25 shadow-sm space-y-6">
        {/* Archive Number Tag & Status Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-lg bg-archive-paper/30 border border-dusty-violet/20">
          <div>
            <span className="text-[10px] font-mono text-dusty-violet block uppercase tracking-wider">
              Assigned Archive Identifier
            </span>
            <span className="font-mono text-sm font-bold text-deep-archive">
              {initialData?.archiveNumber || `${suggestedArchiveNumber} (Automatic)`}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div>
              <span className="text-[10px] font-mono text-dusty-violet block uppercase tracking-wider mb-1">
                Accession State
              </span>
              <div className="flex items-center gap-1 bg-cold-paper p-1 rounded border border-dusty-violet/20 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setStatus("DRAFT")}
                  className={`px-3 py-1 rounded transition ${
                    status === "DRAFT"
                      ? "bg-amber-100 text-amber-900 font-bold"
                      : "text-deep-archive/60 hover:text-deep-archive"
                  }`}
                >
                  DRAFT
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("PUBLISHED")}
                  className={`px-3 py-1 rounded transition ${
                    status === "PUBLISHED"
                      ? "bg-emerald-100 text-emerald-900 font-bold"
                      : "text-deep-archive/60 hover:text-deep-archive"
                  }`}
                >
                  PUBLISHED
                </button>
              </div>
            </div>

            <div className="pl-4 border-l border-dusty-violet/20">
              <span className="text-[10px] font-mono text-dusty-violet block uppercase tracking-wider mb-1">
                Featured Flag
              </span>
              <label className="flex items-center gap-1.5 cursor-pointer text-xs font-mono text-deep-archive pt-1">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded text-discovery-orange focus:ring-deep-archive"
                />
                <Sparkles className="w-3.5 h-3.5 text-discovery-orange" />
                <span>Feature on Homepage</span>
              </label>
            </div>
          </div>
        </div>

        {/* Title and Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono font-semibold text-deep-archive uppercase tracking-wider mb-1">
              Discovery Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={handleTitleChange}
              placeholder="e.g. Radio Garden"
              className="w-full px-3 py-2 text-sm rounded bg-cold-paper border border-dusty-violet/30 text-deep-archive focus:outline-none focus:border-deep-archive focus:ring-1 focus:ring-deep-archive font-sans"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-mono font-semibold text-deep-archive uppercase tracking-wider">
                SEO-Friendly Slug *
              </label>
              <button
                type="button"
                onClick={() => {
                  setAutoSlug(!autoSlug);
                  if (!autoSlug) setSlug(slugify(title));
                }}
                className="text-[11px] font-mono text-archive-indigo hover:text-discovery-orange flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>{autoSlug ? "Custom" : "Auto-sync"}</span>
              </button>
            </div>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => {
                setAutoSlug(false);
                setSlug(e.target.value.toLowerCase().trim());
              }}
              placeholder="e.g. radio-garden"
              className="w-full px-3 py-2 text-xs font-mono rounded bg-cold-paper border border-dusty-violet/30 text-deep-archive focus:outline-none focus:border-deep-archive"
            />
          </div>
        </div>

        {/* Category & Official URL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono font-semibold text-deep-archive uppercase tracking-wider mb-1">
              Curated Cabinet (Category) *
            </label>
            <select
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm font-mono rounded bg-cold-paper border border-dusty-violet/30 text-deep-archive focus:outline-none focus:border-deep-archive"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-deep-archive uppercase tracking-wider mb-1">
              Official Website URL *
            </label>
            <div className="relative">
              <input
                type="url"
                required
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://radio.garden"
                className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm font-mono rounded bg-cold-paper border border-dusty-violet/30 text-deep-archive focus:outline-none focus:border-deep-archive"
              />
              <LinkIcon className="w-3.5 h-3.5 text-dusty-violet absolute left-2.5 top-3" />
            </div>
          </div>
        </div>

        {/* Image Preview & URL */}
        <div>
          <label className="block text-xs font-mono font-semibold text-deep-archive uppercase tracking-wider mb-1">
            Cover / Screenshot Image URL *
          </label>
          <div className="flex flex-col sm:flex-row gap-3 items-start">
            <div className="relative flex-1 w-full">
              <input
                type="url"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm font-mono rounded bg-cold-paper border border-dusty-violet/30 text-deep-archive focus:outline-none focus:border-deep-archive"
              />
              <ImageIcon className="w-3.5 h-3.5 text-dusty-violet absolute left-2.5 top-3" />
            </div>

            {imageUrl && (
              <div className="relative w-28 h-18 rounded border border-dusty-violet/30 overflow-hidden bg-archive-paper/50 shrink-0">
                <Image
                  src={imageUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-xs font-mono font-semibold text-deep-archive uppercase tracking-wider mb-1">
            Short Description (Card synopsis, 10–300 characters) *
          </label>
          <textarea
            required
            rows={2}
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="A three-dimensional globe allowing you to explore live radio broadcasts..."
            className="w-full px-3 py-2 text-xs sm:text-sm rounded bg-cold-paper border border-dusty-violet/30 text-deep-archive focus:outline-none focus:border-deep-archive font-sans"
          />
        </div>

        {/* Full Description */}
        <div>
          <label className="block text-xs font-mono font-semibold text-deep-archive uppercase tracking-wider mb-1">
            Full Description (Comprehensive editorial narrative) *
          </label>
          <textarea
            required
            rows={5}
            value={fullDescription}
            onChange={(e) => setFullDescription(e.target.value)}
            placeholder="Detailed overview of how this curiosity functions, who built it, and why it is memorable..."
            className="w-full px-3 py-2 text-xs sm:text-sm rounded bg-cold-paper border border-dusty-violet/30 text-deep-archive focus:outline-none focus:border-deep-archive font-sans"
          />
        </div>

        {/* Editorial Sections: Why Interesting & What to Explore */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono font-semibold text-deep-archive uppercase tracking-wider mb-1">
              Why We Selected It *
            </label>
            <textarea
              required
              rows={4}
              value={whyInteresting}
              onChange={(e) => setWhyInteresting(e.target.value)}
              placeholder="Explain the unique conceptual angle, technical feat, or artistic merit..."
              className="w-full px-3 py-2 text-xs sm:text-sm rounded bg-cold-paper border border-dusty-violet/30 text-deep-archive focus:outline-none focus:border-deep-archive font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-deep-archive uppercase tracking-wider mb-1">
              What Visitors Can Explore or Do *
            </label>
            <textarea
              required
              rows={4}
              value={whatToExplore}
              onChange={(e) => setWhatToExplore(e.target.value)}
              placeholder="Actionable steps or key easter eggs visitors should test out..."
              className="w-full px-3 py-2 text-xs sm:text-sm rounded bg-cold-paper border border-dusty-violet/30 text-deep-archive focus:outline-none focus:border-deep-archive font-sans"
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-mono font-semibold text-deep-archive uppercase tracking-wider mb-1">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Radio, 3D Globe, Audio, Cartography, WebGL"
            className="w-full px-3 py-2 text-xs sm:text-sm font-mono rounded bg-cold-paper border border-dusty-violet/30 text-deep-archive focus:outline-none focus:border-deep-archive"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-dusty-violet/20 flex items-center justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2.5 rounded bg-deep-archive hover:bg-archive-indigo text-cold-paper font-mono text-xs font-semibold tracking-wider transition flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>SAVING TO ARCHIVE...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-discovery-orange" />
                <span>{isEditing ? "UPDATE DISCOVERY" : "SAVE TO ARCHIVE"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

export default DiscoveryForm;
