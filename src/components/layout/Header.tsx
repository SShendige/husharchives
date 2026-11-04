"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Menu, X, Compass, ExternalLink } from "lucide-react";
import Logo from "../brand/Logo";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Explore", href: "/explore" },
    { label: "Categories", href: "/categories" },
    { label: "About", href: "/about" },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 bg-cold-paper/90 backdrop-blur-md border-b border-dusty-violet/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Logo size="md" withTagline={false} />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8" aria-label="Main navigation">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium tracking-wide transition-colors duration-150 py-1 border-b-2 ${
                    active
                      ? "text-deep-archive border-discovery-orange font-semibold"
                      : "text-deep-archive/75 border-transparent hover:text-deep-archive hover:border-dusty-violet/40"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Search bar & Admin link */}
          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search curiosities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-52 lg:w-64 pl-9 pr-3 py-1.5 text-xs font-mono rounded-full bg-archive-paper/30 border border-dusty-violet/30 focus:outline-none focus:border-deep-archive focus:ring-1 focus:ring-deep-archive transition placeholder:text-dusty-violet/70 text-deep-archive"
              />
              <Search className="w-4 h-4 text-dusty-violet absolute left-3 top-2.5 pointer-events-none" />
            </form>

            <Link
              href="/admin"
              className="text-xs font-mono px-3 py-1.5 rounded border border-archive-indigo/30 text-archive-indigo hover:bg-archive-indigo hover:text-cold-paper transition tracking-wider flex items-center gap-1"
              title="Admin Portal"
            >
              <span>ADMIN</span>
            </Link>
          </div>

          {/* Mobile menu and search toggle buttons */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Toggle search"
              className="p-2 text-deep-archive hover:text-discovery-orange transition"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
              className="p-2 text-deep-archive hover:text-discovery-orange transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile search bar dropdown */}
      {isSearchOpen && (
        <div className="md:hidden px-4 py-3 bg-cold-paper border-b border-dusty-violet/20">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              autoFocus
              placeholder="Search curiosities, archives, experiments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm font-mono rounded-md bg-archive-paper/40 border border-dusty-violet/30 focus:outline-none focus:border-deep-archive"
            />
            <Search className="w-4 h-4 text-dusty-violet absolute left-3 top-3 pointer-events-none" />
          </form>
        </div>
      )}

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-dusty-violet/20 bg-cold-paper px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  active
                    ? "bg-deep-archive text-cold-paper"
                    : "text-deep-archive hover:bg-archive-paper/40"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-dusty-violet/20">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-mono text-archive-indigo bg-archive-paper/30 hover:bg-archive-indigo hover:text-cold-paper transition"
            >
              Administrative Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
