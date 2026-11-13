"use client";

import { useRef, useState, useEffect } from "react";
import { LetterItem } from "@/types";
import { getPreset } from "@/lib/presets";
import { toPng } from "html-to-image";
import { Download, X, Mail, Image as ImageIcon, Check } from "lucide-react";

interface StoryExporterProps {
  letter: LetterItem;
  recipientUsername: string;
  onClose: () => void;
}

export default function StoryExporter({
  letter,
  recipientUsername,
  onClose,
}: StoryExporterProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const preset = getPreset(letter.presetStyle);

  const imageAttachment = letter.attachments.find((a) => a.type === "IMAGE");
  const dateFormatted = new Date(letter.createdAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    setDownloadSuccess(false);

    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        cacheBust: true,
      });

      const link = document.createElement("a");
      link.download = `warkat-story-${recipientUsername}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to generate image:", err);
      alert("Gagal mengunduh gambar. Silakan coba kembali.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Bagikan Surat ke Instagram Story"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
    >
      <div className="relative w-full max-w-md bg-[#FBF8F3] rounded-2xl border border-[#D8C7AA] shadow-2xl p-6 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E8DEC8]">
          <div className="flex items-center gap-2 text-[#231F20]">
            <div className="w-7 h-7 rounded-full bg-[#9B2C2C] flex items-center justify-center text-white">
              <Mail className="w-3.5 h-3.5" />
            </div>
            <h2 className="font-serif font-bold text-base">
              Bagikan ke Instagram Story
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#736A65] hover:text-[#231F20] hover:bg-[#EDE2D0] rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
            aria-label="Tutup pratinjau story"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Story Card Container to capture (9:16 aspect ratio simulation) */}
        <div className="my-5 flex justify-center">
          <div
            ref={cardRef}
            className={`w-[320px] min-h-[500px] p-6 rounded-2xl border flex flex-col justify-between shadow-xl text-left relative overflow-hidden ${
              preset.paperBg
            } ${preset.paperBorder}`}
          >
            {/* Top Bar of the Card */}
            <div>
              <div className="flex items-center justify-between border-b pb-3 border-black/10">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-serif font-bold ${
                      preset.sealColor
                    }`}
                  >
                    W
                  </div>
                  <div>
                    <p className="text-[11px] font-sans font-semibold tracking-wide uppercase text-black/60 leading-none">
                      Warkat Rahasia
                    </p>
                    <p className="text-xs font-serif font-bold text-black/80 mt-0.5">
                      untuk @{recipientUsername}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-sans text-black/50">
                  {dateFormatted}
                </span>
              </div>

              {/* Sender Name */}
              <div className="mt-4">
                <span className="text-[11px] uppercase tracking-wider text-black/50 font-sans">
                  Dari:
                </span>
                <p className="text-sm font-semibold font-serif text-black/90">
                  {letter.senderName || "Teman Rahasia"}
                </p>
              </div>

              {/* Letter Content */}
              <div className="mt-3 py-2">
                <p
                  className={`text-sm leading-relaxed whitespace-pre-wrap font-serif ${
                    preset.paperText
                  }`}
                >
                  &ldquo;{letter.content}&rdquo;
                </p>
              </div>

              {/* Attached Image if any */}
              {imageAttachment && (
                <div className="mt-3 rounded-lg overflow-hidden border border-black/10 bg-black/5 p-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageAttachment.fileUrl}
                    alt="Lampiran foto"
                    className="w-full h-36 object-cover rounded-md"
                    crossOrigin="anonymous"
                  />
                  <span className="text-[10px] text-black/50 px-1 pt-1 flex items-center gap-1 font-sans">
                    <ImageIcon className="w-3 h-3" /> Lampiran Foto Kenangan
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Watermark / CTA */}
            <div className="pt-4 border-t border-black/10 flex items-center justify-between text-[11px] text-black/60 font-sans">
              <span className="font-serif italic">Kirim suratmu di:</span>
              <span className="font-semibold px-2 py-0.5 rounded bg-black/5 font-mono">
                warkat.me/u/{recipientUsername}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleDownloadImage}
            disabled={downloading}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-[#9B2C2C] hover:bg-[#822121] active:bg-[#6D1B1B] shadow-md transition-all min-h-[44px] disabled:opacity-60"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-300 stroke-[3]" />
                <span>Gambar Berhasil Diunduh!</span>
              </>
            ) : downloading ? (
              <span>Sedang Merender Gambar...</span>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Unduh Gambar Story</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
