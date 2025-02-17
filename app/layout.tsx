import type { Metadata } from "next";
import { Geist, Geist_Mono, Lily_Script_One } from "next/font/google";
import "./globals.css";

const lilyscript = Lily_Script_One({
  variable: "--font-lily-script",
  subsets: ["latin"],
  weight: ["400"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Insta Recipe",
  description: "Generate Recipes with just Images.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${lilyscript.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
