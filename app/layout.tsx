//app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import RegisterSW from "./register-sw";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export const viewport = {
  width: 430,
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#6f2dbd",
};


export const metadata: Metadata = {
  title: "Dapur Buzzer Landing Page",
  description: "Dapur Buzzer Landing Page",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/favicon.ico", apple: "/icons/logo-192x192.png" },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Dapur Buzzer",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" data-scroll-behavior="smooth">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <RegisterSW />
        {children}
      </body>
    </html>
  );
}
