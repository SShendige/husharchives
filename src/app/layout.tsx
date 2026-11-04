import type { Metadata, Viewport } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#363062",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "HUSH ARCHIVE — A catalogue of internet curiosities",
    template: "%s | HUSH ARCHIVE",
  },
  description:
    "A global digital discovery platform that curates unusual websites, independent digital creations, interactive experiences, browser experiments and overlooked corners of the internet.",
  keywords: [
    "internet curiosities",
    "web art",
    "digital experiments",
    "hidden websites",
    "indie web",
    "browser experiments",
    "digital archive",
  ],
  openGraph: {
    title: "HUSH ARCHIVE — A catalogue of internet curiosities",
    description:
      "Curating unusual websites, independent digital creations, interactive experiences, and overlooked corners of the web.",
    type: "website",
    locale: "en_US",
    siteName: "HUSH ARCHIVE",
  },
  twitter: {
    card: "summary_large_image",
    title: "HUSH ARCHIVE — A catalogue of internet curiosities",
    description:
      "Curating unusual websites, independent digital creations, interactive experiences, and overlooked corners of the web.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${plexMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cold-paper text-deep-archive">
        {children}
      </body>
    </html>
  );
}
