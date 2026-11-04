"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import {
  deleteDiscoveryAction,
  toggleStatusAction,
  toggleFeaturedAction,
} from "@/actions/discoveryActions";
import {
  Trash2,
  Edit,
  ExternalLink,
  Sparkles,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Loader2,
} from "lucide-react";

interface DiscoveryItem {
  id: string;
  archiveNumber: string;
  title: string;
  slug: string;
  websiteUrl: string;
  category: {
    name: string;
    slug: string;
  };
  categoryId: string;
  isFeatured: boolean;
  status: "DRAFT" | "PUBLISHED";
  createdAt: Date | string;
}

interface DiscoveriesTableProps {
  initialDiscoveries: DiscoveryItem[];
  categories: { id: string; name: string }[];
}

export function DiscoveriesTable({
  initialDiscoveries,
  categories,
}: DiscoveriesTableProps) {
  const [items, setItems] = useState<DiscoveryItem[]>(initialDiscoveries);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleToggleStatus = (id: string) => {
    setLoadingId(id);
    startTransition(async () => {
      const res = await toggleStatusAction(id);
      if (res.success && res.status) {
        setItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: res.status as "DRAFT" | "PUBLISHED" } : item
          )
        );
      }
      setLoadingId(null);
    });
  };

  const handleToggleFeatured = (id: string) => {
    setLoadingId(id);
    startTransition(async () => {
      const res = await toggleFeaturedAction(id);
      if (res.success && res.isFeatured !== undefined) {
        setItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, isFeatured: res.isFeatured! } : item
          )
        );
      }
      setLoadingId(null);
    });
  };

  const handleDelete = (id: string, title: string) => {
    if (!window.confirm(`Are you certain you want to permanently delete "${title}"?`)) {
      return;
    }

    setLoadingId(id);
    startTransition(async () => {
      const res = await deleteDiscoveryAction(id);
      if (res.success) {
        setItems((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert(res.error || "Failed to delete discovery.");
      }
      setLoadingId(null);
    });
  };

  // Filter items locally
  const filtered = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.archiveNumber.toLowerCase().includes(search.toLowerCase()) ||
      item.slug.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || item.categoryId === selectedCategory;

    const matchesStatus =
      selectedStatus === "all" || item.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-lg border border-dusty-violet/20 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between shadow-sm">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by title, archive file number, or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs font-mono rounded bg-cold-paper border border-dusty-violet/30 text-deep-archive focus:outline-none focus:border-deep-archive"
          />
          <Search className="w-4 h-4 text-dusty-violet absolute left-3 top-2.5 pointer-events-none" />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs font-mono rounded bg-cold-paper border border-dusty-violet/30 text-deep-archive focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs font-mono rounded bg-cold-paper border border-dusty-violet/30 text-deep-archive focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="PUBLISHED">Published Only</option>
            <option value="DRAFT">Drafts Only</option>
          </select>

          <span className="text-xs font-mono text-dusty-violet pl-2">
            {filtered.length} of {items.length} records
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-dusty-violet/25 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="bg-cold-paper/80 border-b border-dusty-violet/20 text-[11px] font-mono text-archive-indigo uppercase tracking-wider">
                <th className="py-3 px-4">FILE #</th>
                <th className="py-3 px-4">Title & Link</th>
                <th className="py-3 px-4">Cabinet</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Featured</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dusty-violet/10">
              {filtered.length > 0 ? (
                filtered.map((item) => {
                  const isLoading = loadingId === item.id && isPending;
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-cold-paper/30 transition-colors font-medium text-deep-archive"
                    >
                      <td className="py-3 px-4 font-mono font-bold whitespace-nowrap">
                        {item.archiveNumber}
                      </td>

                      <td className="py-3 px-4 max-w-sm">
                        <div className="font-semibold">{item.title}</div>
                        <div className="text-[11px] font-mono text-dusty-violet truncate">
                          /{item.slug}
                        </div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-archive-paper/50 font-mono text-[11px]">
                          {item.category.name}
                        </span>
                      </td>

                      {/* Status toggle button */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(item.id)}
                          disabled={isLoading}
                          className={`px-2.5 py-1 rounded font-mono text-[10px] font-bold uppercase transition cursor-pointer ${
                            item.status === "PUBLISHED"
                              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                              : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                          }`}
                          title="Click to toggle DRAFT / PUBLISHED"
                        >
                          {isLoading ? (
                            <Loader2 className="w-3 h-3 animate-spin inline" />
                          ) : (
                            item.status
                          )}
                        </button>
                      </td>

                      {/* Featured toggle button */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(item.id)}
                          disabled={isLoading}
                          className={`p-1.5 rounded transition cursor-pointer ${
                            item.isFeatured
                              ? "text-discovery-orange bg-orange-50 hover:bg-orange-100"
                              : "text-dusty-violet/40 hover:text-deep-archive"
                          }`}
                          title="Click to toggle Featured status"
                        >
                          <Sparkles className="w-4 h-4 inline" />
                        </button>
                      </td>

                      <td className="py-3 px-4 font-mono text-dusty-violet whitespace-nowrap">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>

                      {/* Operations */}
                      <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                        <Link
                          href={`/admin/discoveries/${item.id}/edit`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-archive-paper/40 hover:bg-archive-paper text-deep-archive font-mono text-[11px] transition"
                        >
                          <Edit className="w-3 h-3" />
                          <span>Edit</span>
                        </Link>

                        {item.status === "PUBLISHED" && (
                          <Link
                            href={`/explore/${item.slug}`}
                            target="_blank"
                            className="inline-flex items-center p-1 rounded hover:bg-cold-paper text-archive-indigo"
                            title="Preview on live site"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDelete(item.id, item.title)}
                          disabled={isLoading}
                          className="inline-flex items-center p-1 rounded hover:bg-rose-50 text-rose-600 transition cursor-pointer"
                          title="Delete discovery"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-dusty-violet font-mono">
                    No discoveries match current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DiscoveriesTable;
