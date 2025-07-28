import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Muslim Wedding Hub - Find Halal Wedding Vendors",
  description: "Connect with verified Muslim wedding vendors who understand your values and traditions. From venues with prayer spaces to halal caterers.",
  keywords: "Muslim wedding, halal vendors, Islamic wedding, nikah, Muslim matrimony",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers session={null}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
