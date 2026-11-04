import React from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Compass, HelpCircle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-cold-paper">
      <Header />

      <main className="flex-1 flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center space-y-6 bg-white p-8 sm:p-10 rounded-xl border border-dusty-violet/25 shadow-sm">
          <div className="w-16 h-16 mx-auto rounded-full bg-archive-paper/50 flex items-center justify-center text-deep-archive">
            <HelpCircle className="w-8 h-8 text-discovery-orange" />
          </div>

          <div className="space-y-2">
            <span className="font-mono text-xs text-discovery-orange font-bold uppercase tracking-widest">
              FILE RECORD 404
            </span>
            <h1
              className="text-2xl sm:text-3xl font-bold text-deep-archive font-display"
              style={{
                fontFamily:
                  "'Bahnschrift', 'Bahnschrift SemiBold', 'DIN Alternate', sans-serif",
              }}
            >
              Missing Archival Node
            </h1>
            <p className="text-sm text-deep-archive/80 font-sans leading-relaxed">
              The artifact or catalog page you were searching for has either migrated to another sector or does not exist in the collection.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto px-5 py-2.5 rounded bg-deep-archive hover:bg-archive-indigo text-cold-paper font-mono text-xs font-semibold tracking-wider transition flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>RETURN HOME</span>
            </Link>
            <Link
              href="/explore"
              className="w-full sm:w-auto px-5 py-2.5 rounded bg-archive-paper/60 hover:bg-archive-paper text-deep-archive font-mono text-xs font-semibold tracking-wider transition flex items-center justify-center gap-1.5 border border-dusty-violet/30"
            >
              <Compass className="w-3.5 h-3.5 text-discovery-orange" />
              <span>EXPLORE ARCHIVE</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
