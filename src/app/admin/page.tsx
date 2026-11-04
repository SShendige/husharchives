import React from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import {
  FileText,
  FolderGit2,
  CheckCircle2,
  FileEdit,
  Plus,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Users,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    totalDiscoveries,
    publishedCount,
    draftCount,
    totalCategories,
    totalSubscribers,
    recentDiscoveries,
  ] = await Promise.all([
    prisma.discovery.count(),
    prisma.discovery.count({ where: { status: "PUBLISHED" } }),
    prisma.discovery.count({ where: { status: "DRAFT" } }),
    prisma.category.count(),
    prisma.newsletterSubscriber.count(),
    prisma.discovery.findMany({
      include: {
        category: {
          select: { name: true, slug: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);

  const stats = [
    {
      label: "TOTAL DISCOVERIES",
      value: totalDiscoveries,
      icon: FileText,
      color: "text-deep-archive",
      bgColor: "bg-archive-paper/50",
    },
    {
      label: "PUBLISHED",
      value: publishedCount,
      icon: CheckCircle2,
      color: "text-emerald-700",
      bgColor: "bg-emerald-50",
    },
    {
      label: "DRAFT QUEUE",
      value: draftCount,
      icon: FileEdit,
      color: "text-amber-700",
      bgColor: "bg-amber-50",
    },
    {
      label: "CABINETS / CATEGORIES",
      value: totalCategories,
      icon: FolderGit2,
      color: "text-archive-indigo",
      bgColor: "bg-indigo-50",
    },
    {
      label: "DISPATCH SUBSCRIBERS",
      value: totalSubscribers,
      icon: Users,
      color: "text-discovery-orange",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dusty-violet/20 pb-5">
        <div>
          <span className="text-xs font-mono text-discovery-orange uppercase tracking-wider font-semibold">
            Administrative Command
          </span>
          <h1
            className="text-2xl sm:text-3xl font-bold text-deep-archive font-display"
            style={{
              fontFamily:
                "'Bahnschrift', 'Bahnschrift SemiBold', 'DIN Alternate', sans-serif",
            }}
          >
            Archive Overview
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/categories"
            className="px-3.5 py-2 rounded border border-dusty-violet/30 bg-white hover:bg-archive-paper/40 text-deep-archive font-mono text-xs font-medium transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Category</span>
          </Link>

          <Link
            href="/admin/discoveries/new"
            className="px-4 py-2 rounded bg-deep-archive hover:bg-archive-indigo text-cold-paper font-mono text-xs font-semibold tracking-wider transition flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4 text-discovery-orange" />
            <span>ACCESSION DISCOVERY</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white p-5 rounded-lg border border-dusty-violet/20 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-dusty-violet tracking-wider">
                  {stat.label}
                </span>
                <div className={`p-1.5 rounded ${stat.bgColor} ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-deep-archive font-display">
                {stat.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recently Added Discoveries Table */}
      <div className="bg-white rounded-lg border border-dusty-violet/25 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-dusty-violet/15 flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="font-display font-semibold text-lg text-deep-archive">
              Recent Discoveries
            </h2>
            <p className="text-xs font-mono text-dusty-violet">
              Latest items catalogued into the repository
            </p>
          </div>
          <Link
            href="/admin/discoveries"
            className="text-xs font-mono text-archive-indigo hover:text-discovery-orange font-medium flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="bg-cold-paper/60 border-b border-dusty-violet/15 text-[11px] font-mono text-archive-indigo uppercase tracking-wider">
                <th className="py-3 px-4">FILE #</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Cabinet</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dusty-violet/10">
              {recentDiscoveries.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-cold-paper/30 transition-colors font-medium text-deep-archive"
                >
                  <td className="py-3 px-4 font-mono font-semibold text-deep-archive whitespace-nowrap">
                    {item.archiveNumber}
                  </td>
                  <td className="py-3 px-4 max-w-xs truncate">
                    <span className="font-semibold">{item.title}</span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-archive-paper/50 text-deep-archive font-mono text-[11px]">
                      {item.category.name}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {item.status === "PUBLISHED" ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                        PUBLISHED
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-mono text-[10px] font-bold">
                        DRAFT
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {item.isFeatured ? (
                      <span className="inline-flex items-center gap-1 text-discovery-orange font-mono text-[11px] font-semibold">
                        <Sparkles className="w-3 h-3" />
                        <span>YES</span>
                      </span>
                    ) : (
                      <span className="text-dusty-violet/60 font-mono text-[11px]">
                        NO
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono text-dusty-violet whitespace-nowrap">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                    <Link
                      href={`/admin/discoveries/${item.id}/edit`}
                      className="px-2.5 py-1 rounded bg-archive-paper/40 hover:bg-archive-paper text-deep-archive font-mono text-[11px] transition"
                    >
                      Edit
                    </Link>
                    {item.status === "PUBLISHED" && (
                      <Link
                        href={`/explore/${item.slug}`}
                        target="_blank"
                        className="px-2 py-1 text-dusty-violet hover:text-deep-archive font-mono text-[11px]"
                      >
                        <ExternalLink className="w-3.5 h-3.5 inline" />
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
