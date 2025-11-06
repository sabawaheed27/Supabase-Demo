import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
export const runtime = "nodejs"; // Force Node.js runtime for Supabase compatibility
import "./globals.css";

import { QueryClientProvider } from "@/provider/query-client-provider";
import { Toaster } from "sonner";
import Footer from "./components/Footer";

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
        <div className="flex flex-col min-h-screen">
          <Toaster />
          <QueryClientProvider>
            {/* <Header/> */}
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </QueryClientProvider>
        </div>
      </body>
    </html>
  );
}


