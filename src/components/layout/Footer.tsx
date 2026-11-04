import React from "react";
import Link from "next/link";
import Logo from "../brand/Logo";
import { Compass, Sparkles, Terminal, Globe, ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-deep-archive text-cold-paper border-t border-dusty-violet/30 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="inline-block p-1 bg-cold-paper/10 rounded-md">
              <Logo size="md" withTagline={false} />
            </div>
            <p className="text-cold-paper/80 font-mono text-sm max-w-md leading-relaxed">
              A catalogue of internet curiosities. Curating unusual websites, independent digital creations, interactive experiences, and overlooked corners of the web.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs font-mono text-archive-paper">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-cold-paper/10 border border-cold-paper/10">
                <span className="w-2 h-2 rounded-full bg-discovery-orange animate-pulse" />
                ARCHIVE ONLINE
              </span>
              <span>EST. 2026</span>
            </div>
          </div>

          {/* Directory Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono tracking-widest text-archive-paper uppercase">
              Directory
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/explore"
                  className="text-cold-paper/70 hover:text-discovery-orange transition flex items-center gap-1 group"
                >
                  <span>Explore Index</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-cold-paper/70 hover:text-discovery-orange transition flex items-center gap-1 group"
                >
                  <span>All Categories</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="/explore?featured=true"
                  className="text-cold-paper/70 hover:text-discovery-orange transition flex items-center gap-1 group"
                >
                  <span>Featured Selections</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-cold-paper/70 hover:text-discovery-orange transition flex items-center gap-1 group"
                >
                  <span>Editorial Philosophy</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Network & Social Placeholders */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono tracking-widest text-archive-paper uppercase">
              Network
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cold-paper/70 hover:text-discovery-orange transition flex items-center gap-1"
                >
                  <span>Dispatch (X / Twitter)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://are.na"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cold-paper/70 hover:text-discovery-orange transition flex items-center gap-1"
                >
                  <span>Channels (Are.na)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cold-paper/70 hover:text-discovery-orange transition flex items-center gap-1"
                >
                  <span>Source Code (GitHub)</span>
                </a>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="text-archive-paper/60 hover:text-cold-paper transition font-mono text-xs block pt-2"
                >
                  Administrator Access →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-cold-paper/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-cold-paper/50">
          <p>© {new Date().getFullYear()} HUSH ARCHIVE. All curated trademarks belong to their respective creators.</p>
          <p className="flex items-center gap-2">
            <span>COLD PAPER #F5FEFF</span>
            <span>•</span>
            <span>DEEP ARCHIVE #363062</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
