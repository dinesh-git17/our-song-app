import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AudioProvider } from "@/contexts/AudioContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Carolina, My Everything | A Song For You",
  description: "A special surprise for Carolina",
  viewport:
    "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-[hsl(240_10%_4%)]">
      <body className={`${inter.className} bg-[hsl(240_10%_4%)] min-h-screen`}>
        <AudioProvider>{children}</AudioProvider>
      </body>
    </html>
  );
}
