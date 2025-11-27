import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AudioProvider } from "@/contexts/AudioContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Carolina, My Everything | A Song For You",
  description: "A special surprise for Carolina",
  viewport:
    "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Carolina, My Everything",
    description: "A special surprise for Carolina ❤️",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Carolina, My Everything - A Song For You",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Carolina, My Everything",
    description: "A special surprise for Carolina ❤️",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-[hsl(240_10%_4%)]">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-[hsl(240_10%_4%)] min-h-screen`}>
        <AudioProvider>{children}</AudioProvider>
      </body>
    </html>
  );
}
