import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
export const runtime = "nodejs"; // Force Node.js runtime for Supabase compatibility
import "./globals.css";

import { QueryClientProvider } from "@/provider/query-client-provider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Quad",
  description: "A full-stack social platform built with Next.js and Supabase.",
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
        <Toaster />
        <QueryClientProvider>
        {/* <Header/> */}
        {children}
         </QueryClientProvider>
      </body>
    </html>
  );
}
