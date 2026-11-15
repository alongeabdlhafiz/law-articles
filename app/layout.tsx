import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://law-articles.vercel.app"),
  title: {
    default: "Femi Falana Chambers, Faculty of Law, OOU Legal Publications",
    template: "%s | Femi Falana Chambers",
  },
  description:
    "Articles, opinions and educational content from law students and legal writers.",
  openGraph: {
    siteName: "Femi Falana Chambers, Faculty of Law, OOU Legal Publications",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}