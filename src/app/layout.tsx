import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "المصحف الإلكتروني - القرآن الكريم مع التفسير والاستماع",
  description: "منصة قرآنية متكاملة لقراءة القرآن الكريم بالخط العثماني مع التفسير والاستماع لتلاوات عديدة بأصوات قراء مشهورين",
  keywords: ["القرآن", "المصحف الإلكتروني", "التفسير", "الاستماع", "القرآن الكريم", "Quran", "Tafsir"],
  authors: [{ name: "فريق المصحف الإلكتروني" }],
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
