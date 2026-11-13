import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Warkat | Platform Surat & Pesan Anonim Taktil",
  description:
    "Kirim dan terima surat anonim dengan amplop berstempel, lembaran perkamen klasik, foto kenangan, dan pesan suara personal.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#FBF8F3] text-[#231F20] stationery-texture">
        <Suspense
          fallback={
            <header className="sticky top-0 z-40 h-16 bg-[#FBF8F3] border-b border-[#E8DEC8]" />
          }
        >
          <Navbar />
        </Suspense>
        <main className="flex-1 flex flex-col">{children}</main>
        <footer className="border-t border-[#E8DEC8] py-8 text-center text-xs text-[#736A65] bg-[#F7F2E8]/60">
          <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="font-serif italic text-sm text-[#544B46]">
              Warkat: menghidupkan kembali kehangatan surat fisik di ruang digital.
            </p>
            <p className="text-xs text-[#857B75]">
              Disegel dengan privasi & pesan tanpa jejak.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
