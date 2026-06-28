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
  title: {
    default: "Dog Jump",
    template: "%s | Dog Jump",
  },
  description:
    "A tiny pixel dog jumping game with quick runs, score chasing, and playful coaching.",
  applicationName: "Dog Jump",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Dog Jump",
    description:
      "A tiny pixel dog jumping game with quick runs, score chasing, and playful coaching.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Dog Jump",
    description:
      "A tiny pixel dog jumping game with quick runs, score chasing, and playful coaching.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
