import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/providers/AppProviders";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Swifto · Trip & Pay Calculator",
  description:
    "Mobile-friendly dispatcher for Swift drivers to track trips, loads, stops, and weekly pay.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <AppProviders>
          <div className="relative min-h-screen overflow-hidden bg-background">
            <div
              className="blurred-bg pointer-events-none absolute inset-0"
              aria-hidden
            />
            <main className="relative z-10">{children}</main>
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
