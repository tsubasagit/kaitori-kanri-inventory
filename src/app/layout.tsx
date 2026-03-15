import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "古着在庫管理",
  description: "古着買取・販売店向けの店舗管理システム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
