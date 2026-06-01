import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "sonner";
import ScrollToTop from "@/components/ScrollToTop";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Hubble — AI Agent Platform",
    template: "%s | Hubble",
  },
  description:
    "Automate real-world tasks with powerful AI agents. Web scraping, code generation, ISO management, SQL generation, regex building — all from a single platform.",
  keywords: ["AI agents", "automation", "web scraper", "code generator", "LangGraph", "Groq"],
  authors: [{ name: "RAJ Tripathi" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Hubble",
    title: "Hubble — AI Agent Platform",
    description: "Automate real-world tasks with powerful AI agents.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hubble — AI Agent Platform",
    description: "Automate real-world tasks with powerful AI agents.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={cn("h-full", inter.variable, spaceGrotesk.variable, jetbrainsMono.variable)}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="flex flex-col min-h-screen antialiased">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1 page-fade">
            {children}
          </main>
          <Toaster position="top-right" richColors closeButton toastOptions={{ duration: 4000 }} />
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
