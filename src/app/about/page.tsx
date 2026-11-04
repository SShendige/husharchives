import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Logo from "@/components/brand/Logo";
import Link from "next/link";
import { Compass, Sparkles, BookOpen, Layers, ShieldCheck, Heart } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About the Archive",
  description: "Learn about HUSH ARCHIVE, why it exists, our editorial philosophy, and what kinds of internet curiosities we preserve.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-cold-paper">
      <Header />

      <main className="flex-1 py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header */}
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <Logo size="lg" withTagline={false} />
            </div>

            <div className="inline-block px-3 py-1 rounded-full bg-archive-paper/60 border border-dusty-violet/30 font-mono text-xs text-archive-indigo font-medium">
              MANIFESTO & CURATORIAL CHARTER
            </div>

            <h1
              className="text-4xl sm:text-5xl font-bold text-deep-archive font-display tracking-tight"
              style={{
                fontFamily:
                  "'Bahnschrift', 'Bahnschrift SemiBold', 'DIN Alternate', sans-serif",
              }}
            >
              A catalogue of internet curiosities.
            </h1>

            <p className="text-lg sm:text-xl text-deep-archive/80 max-w-2xl mx-auto font-sans leading-relaxed">
              We preserve, document, and curate the strange, brilliant, artisanal, and overlooked wonders crafted for the open web.
            </p>
          </div>

          {/* Section 1: What is HUSH ARCHIVE */}
          <section className="bg-white rounded-xl border border-dusty-violet/25 p-8 sm:p-10 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-mono text-discovery-orange font-bold uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>What is HUSH ARCHIVE?</span>
            </div>
            <h2
              className="text-2xl font-bold text-deep-archive font-display"
              style={{
                fontFamily:
                  "'Bahnschrift', 'Bahnschrift SemiBold', 'DIN Alternate', sans-serif",
              }}
            >
              A quiet sanctuary for digital wonder.
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-deep-archive/85 font-sans leading-relaxed">
              <p>
                HUSH ARCHIVE is a global digital discovery platform that curates unusual websites, independent digital creations, interactive experiences, browser experiments and overlooked corners of the internet.
              </p>
              <p>
                Every entry in our collection is manually assigned a unique archive number (like <span className="font-mono text-xs bg-archive-paper/50 px-1.5 py-0.5 rounded">FILE 0001</span>), rigorously reviewed for longevity, and catalogued alongside its back-story, user interactions, and technical craft.
              </p>
            </div>
          </section>

          {/* Section 2: Why it exists */}
          <section className="bg-archive-paper/30 rounded-xl border border-dusty-violet/25 p-8 sm:p-10 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-archive-indigo font-bold uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>The Problem We Solve</span>
            </div>
            <h2
              className="text-2xl font-bold text-deep-archive font-display"
              style={{
                fontFamily:
                  "'Bahnschrift', 'Bahnschrift SemiBold', 'DIN Alternate', sans-serif",
              }}
            >
              The web is vast, but discovery has narrowed.
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-deep-archive/85 font-sans leading-relaxed">
              <p>
                The modern internet contains millions of extraordinary personal creations, creative coding experiments, and tactile simulations. Yet discovering genuinely unique and worthwhile experiences has become nearly impossible.
              </p>
              <p>
                Algorithmic social platforms optimize exclusively for outrage, viral churn, and engagement velocity. The slower, meditative, eccentric, and poetic corners of cyberspace are rapidly buried under feeds.
              </p>
              <p>
                HUSH ARCHIVE exists as an underground library: an intentional, human-curated catalogue where genuine curiosity is the only sorting metric.
              </p>
            </div>
          </section>

          {/* Section 3: What We Collect */}
          <section className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-dusty-violet font-bold uppercase tracking-wider">
                <Layers className="w-4 h-4" />
                <span>Scope of Preservation</span>
              </div>
              <h2
                className="text-2xl font-bold text-deep-archive font-display"
                style={{
                  fontFamily:
                    "'Bahnschrift', 'Bahnschrift SemiBold', 'DIN Alternate', sans-serif",
                }}
              >
                What kind of discoveries do we collect?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-lg bg-white border border-dusty-violet/25 space-y-2">
                <h3 className="font-mono font-semibold text-sm text-deep-archive">
                  1. Digital Experiments
                </h3>
                <p className="text-xs sm:text-sm text-deep-archive/75 leading-relaxed">
                  Interactive WebGL environments, physics engines, cellular automata, generative music synthesizers, and procedural experiments.
                </p>
              </div>

              <div className="p-5 rounded-lg bg-white border border-dusty-violet/25 space-y-2">
                <h3 className="font-mono font-semibold text-sm text-deep-archive">
                  2. Hidden Websites
                </h3>
                <p className="text-xs sm:text-sm text-deep-archive/75 leading-relaxed">
                  Surreal hyperlinked universes, cryptic mysteries, ambient window views, and poetic digital shrines.
                </p>
              </div>

              <div className="p-5 rounded-lg bg-white border border-dusty-violet/25 space-y-2">
                <h3 className="font-mono font-semibold text-sm text-deep-archive">
                  3. Learn Something
                </h3>
                <p className="text-xs sm:text-sm text-deep-archive/75 leading-relaxed">
                  Exploratory science visualizers, cosmic zoom scales, deep sea descents, and tactile educational essays.
                </p>
              </div>

              <div className="p-5 rounded-lg bg-white border border-dusty-violet/25 space-y-2">
                <h3 className="font-mono font-semibold text-sm text-deep-archive">
                  4. Internet Playground
                </h3>
                <p className="text-xs sm:text-sm text-deep-archive/75 leading-relaxed">
                  Micro-games, whimsical toys, cursor gadgets, and lighthearted digital amusements crafted without monetization tricks.
                </p>
              </div>

              <div className="p-5 rounded-lg bg-white border border-dusty-violet/25 space-y-2">
                <h3 className="font-mono font-semibold text-sm text-deep-archive">
                  5. Indie Creations
                </h3>
                <p className="text-xs sm:text-sm text-deep-archive/75 leading-relaxed">
                  Boutique webcraft, retro skeuomorphic interfaces, digital gardens, and singular solo-developer labours of love.
                </p>
              </div>

              <div className="p-5 rounded-lg bg-white border border-dusty-violet/25 space-y-2">
                <h3 className="font-mono font-semibold text-sm text-deep-archive">
                  6. Digital Archives
                </h3>
                <p className="text-xs sm:text-sm text-deep-archive/75 leading-relaxed">
                  Historical operating system emulations, net art preservation, computing lore, and decades-long astronomical archives.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Editorial Philosophy */}
          <section className="bg-white rounded-xl border border-dusty-violet/25 p-8 sm:p-10 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-discovery-orange font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Editorial Philosophy</span>
            </div>
            <h2
              className="text-2xl font-bold text-deep-archive font-display"
              style={{
                fontFamily:
                  "'Bahnschrift', 'Bahnschrift SemiBold', 'DIN Alternate', sans-serif",
              }}
            >
              Craft over clicks. Curiosity over metrics.
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-deep-archive/85 font-sans leading-relaxed">
              <ul className="space-y-3 list-disc pl-5">
                <li>
                  <strong>Human verification:</strong> Every single URL is directly tested, verified safe, and documented by curators before accessioning.
                </li>
                <li>
                  <strong>Respect for creators:</strong> We do not rehost, scrape, or paywall the work of others. We direct visitors directly to original creator domains with pristine attribution.
                </li>
                <li>
                  <strong>Zero dark patterns:</strong> No intrusive popups, no surveillance tracking, and no paywalls.
                </li>
                <li>
                  <strong>Durable storage:</strong> All metadata is backed by modern PostgreSQL infrastructure to ensure records persist reliably.
                </li>
              </ul>
            </div>
          </section>

          {/* Call to Explore CTA */}
          <div className="text-center pt-8">
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-md bg-deep-archive hover:bg-archive-indigo text-cold-paper font-mono text-sm font-semibold tracking-wider transition shadow-sm hover:shadow"
            >
              <Compass className="w-4 h-4 text-discovery-orange" />
              <span>START EXPLORING THE CATALOGUE</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
