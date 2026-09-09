import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "material-symbols/outlined.css";
import "./globals.css";


import { getCurrentUser } from "@/lib/auth/session";
import { AppLayout } from "@/components/layout/AppLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ATS Victim - Autonomous Job Tracker",
  description: "AI-powered job application tracking platform with automated Gmail synchronization",
  icons: {
    icon: "/ats-victim-logo.ico",
    shortcut: "/ats-victim-logo.ico",
    apple: "/ats-victim-logo.jpg",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <AppLayout user={user}>
          {children}
        </AppLayout>
      </body>
    </html>
  );
}

