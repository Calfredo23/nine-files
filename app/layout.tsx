import type { Metadata, Viewport } from "next";
import { Courier_Prime, Oswald, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const display = Oswald({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-oswald",
  display: "swap",
});

const serif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-source-serif",
  display: "swap",
});

const mono = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-courier",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://nine-files.vercel.app";

const title = "The Nine Files — a tic-tac-toe case";
const description =
  "Two detectives. Nine clues. Three in a row cracks the case. A tic-tac-toe game built with Next.js and React.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: "The Nine Files",
  authors: [
    { name: "Cedrick Alfredo Catimbang", url: "https://calfredo.is-pinoy.dev" },
  ],
  creator: "Cedrick Alfredo Catimbang",
  keywords: [
    "tic-tac-toe",
    "tic tac toe",
    "React",
    "Next.js",
    "TypeScript",
    "game",
    "noir",
    "portfolio",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "The Nine Files",
    title,
    description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0B0C0E",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${serif.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
