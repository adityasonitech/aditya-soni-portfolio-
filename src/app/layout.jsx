
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

import SiteChrome from "../components/SiteChrome";

export const metadata = {
  metadataBase: new URL("https://adityasoni-dev.vercel.app"),
  verification: {
    google: "xlTzS4rvMxOG6pdWEvNwbHjMejjZW4hmNIPNhg_C208",
  },
  title: {
    default: "Aditya Soni | Full Stack Developer & UI/UX Designer",
    template: "%s | Aditya Soni"
  },
  description: "Creative Full Stack Developer specializing in premium animated web experiences with Next.js, React, and Framer Motion.",
  keywords: ["Aditya Soni", "Full Stack Developer", "UI/UX Designer", "Next.js Developer", "React Developer", "Portfolio", "Web Development", "Gandhinagar", "Ahmedabad"],
  authors: [{ name: "Aditya Soni" }],
  creator: "Aditya Soni",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://adityasoni-dev.vercel.app",
    title: "Aditya Soni | Full Stack Developer & UI/UX Designer",
    description: "Creative Full Stack Developer specializing in premium animated web experiences.",
    siteName: "Aditya Soni Portfolio",
    images: [{
      url: "/og-image.png", // Make sure to add this image to public/
      width: 1200,
      height: 630,
      alt: "Aditya Soni Portfolio"
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aditya Soni | Full Stack Developer & UI/UX Designer",
    description: "Creative Full Stack Developer specializing in premium animated web experiences.",
    images: ["/og-image.png"],
    creator: "@aditya_soni", // Replace with actual handle if exists
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <SiteChrome />
        <main className="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}
