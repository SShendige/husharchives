import React from "react";
import Link from "next/link";
import { getCurrentAdmin } from "@/lib/auth";
import { logoutAction } from "@/actions/authActions";
import { HAMonogram } from "@/components/brand/Logo";
import {
  LayoutDashboard,
  FolderGit2,
  FileText,
  Mail,
  ExternalLink,
  LogOut,
  Shield,
} from "lucide-react";

export const metadata = {
  title: "Admin Dashboard | HUSH ARCHIVE",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();

  // If viewing the login page, don't show the dashboard shell
  if (!admin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-cold-paper">
      {/* Top Admin Bar */}
      <header className="bg-deep-archive text-cold-paper border-b border-dusty-violet/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Brand Monogram + Admin Tag */}
            <div className="flex items-center space-x-3">
              <Link href="/admin" className="flex items-center space-x-2.5">
                <HAMonogram size={28} color="#F5FEFF" accentColor="#DC552C" />
                <span
                  className="font-bold text-base tracking-wider uppercase font-display text-cold-paper"
                  style={{
                    fontFamily:
                      "'Bahnschrift', 'Bahnschrift SemiBold', 'DIN Alternate', sans-serif",
                  }}
                >
                  HUSH ARCHIVE
                </span>
              </Link>
              <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-discovery-orange text-white font-bold">
                ADMIN
              </span>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                target="_blank"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-cold-paper/80 hover:text-cold-paper transition px-2.5 py-1 rounded border border-cold-paper/20"
              >
                <span>Live Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <div className="hidden md:flex items-center gap-1 text-xs font-mono text-archive-paper">
                <Shield className="w-3.5 h-3.5 text-discovery-orange" />
                <span className="truncate max-w-[180px]">{admin.email}</span>
              </div>

              <form action={logoutAction}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1 text-xs font-mono px-3 py-1.5 rounded bg-cold-paper/10 hover:bg-rose-900/60 text-cold-paper transition cursor-pointer"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Secondary Navigation Ribbon */}
        <div className="border-t border-cold-paper/10 bg-deep-archive/90">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-1 sm:space-x-6 py-2 overflow-x-auto text-xs font-mono">
              <Link
                href="/admin"
                className="px-3 py-1.5 rounded hover:bg-cold-paper/10 text-cold-paper transition flex items-center gap-1.5 shrink-0"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-discovery-orange" />
                <span>Overview</span>
              </Link>

              <Link
                href="/admin/discoveries"
                className="px-3 py-1.5 rounded hover:bg-cold-paper/10 text-cold-paper transition flex items-center gap-1.5 shrink-0"
              >
                <FileText className="w-3.5 h-3.5 text-discovery-orange" />
                <span>Discoveries</span>
              </Link>

              <Link
                href="/admin/categories"
                className="px-3 py-1.5 rounded hover:bg-cold-paper/10 text-cold-paper transition flex items-center gap-1.5 shrink-0"
              >
                <FolderGit2 className="w-3.5 h-3.5 text-discovery-orange" />
                <span>Categories</span>
              </Link>

              <Link
                href="/admin/subscribers"
                className="px-3 py-1.5 rounded hover:bg-cold-paper/10 text-cold-paper transition flex items-center gap-1.5 shrink-0"
              >
                <Mail className="w-3.5 h-3.5 text-discovery-orange" />
                <span>Subscribers</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Admin Page Content */}
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
