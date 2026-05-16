import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-heading" });

const title = "KipGo — Store your luggage safely anywhere";
const description = "Find nearby verified luggage storage locations. Book online, drop off your bags, and explore hands-free. Safe, insured, and affordable.";

export const metadata: Metadata = {
  title: {
    default: title,
    template: "%s | KipGo",
  },
  description,
  keywords: ["luggage storage", "baggage storage", "store luggage", "travel", "baggage", "storage near me", "luggage locker"],
  authors: [{ name: "KipGo" }],
  creator: "KipGo",
  publisher: "KipGo",
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "es_CL",
    siteName: "KipGo",
    title,
    description,
    url: "https://kipgo.app",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://kipgo.app",
    languages: {
      en: "https://kipgo.app",
      es: "https://kipgo.app/es",
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable} h-full antialiased`}>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
