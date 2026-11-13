"use client";

import { LetterItem } from "@/types";
import { getPreset } from "@/lib/presets";
import { Mail, Image as ImageIcon, Mic, Star } from "lucide-react";

interface EnvelopeCardProps {
  letter: LetterItem;
  onClick: () => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
}

export default function EnvelopeCard({
  letter,
  onClick,
  onToggleFavorite,
}: EnvelopeCardProps) {
  const preset = getPreset(letter.presetStyle);
  const hasImage = letter.attachments.some((a) => a.type === "IMAGE");
  const hasAudio = letter.attachments.some((a) => a.type === "AUDIO");
  const dateFormatted = new Date(letter.createdAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      role="button"
      tabIndex={0}
      className={`group relative rounded-xl border p-5 transition-all duration-200 cursor-pointer text-left select-none envelope-shadow hover:envelope-shadow-hover hover:-translate-y-1 ${preset.envelopeColor} ${preset.envelopeBorder}`}
      aria-label={`Buka surat dari ${letter.senderName || "Teman Rahasia"} tertanggal ${dateFormatted}`}
    >
      {/* Top bar: Preset badge & Favorite button */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] font-medium tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-black/10 text-inherit backdrop-blur-xs">
          {preset.name}
        </span>
        <button
          type="button"
          onClick={onToggleFavorite}
          className={`p-1.5 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
            letter.isFavorite
              ? "text-[#D97706] bg-amber-100/50 hover:bg-amber-100"
              : "text-inherit/50 hover:text-inherit hover:bg-black/5"
          }`}
          title={letter.isFavorite ? "Hapus dari favorit" : "Tandai favorit"}
          aria-label={letter.isFavorite ? "Hapus dari favorit" : "Tandai favorit"}
        >
          <Star className={`w-4 h-4 ${letter.isFavorite ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Center Seal / Wax emblem */}
      <div className="flex flex-col items-center justify-center py-3">
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md border-2 transition-transform group-hover:scale-105 ${preset.sealColor}`}
        >
          {letter.isRead ? (
            <Mail className="w-6 h-6 opacity-90" />
          ) : (
            <div className="relative flex items-center justify-center">
              <span className="font-serif font-black text-xl italic leading-none select-none">
                W
              </span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
            </div>
          )}
        </div>
        <p className="mt-2 text-xs font-serif italic text-inherit/70">
          {letter.isRead ? "Amplop Terbuka" : "Segel Utuh (Belum Dibaca)"}
        </p>
      </div>

      {/* Sender & Snippet */}
      <div className="mt-3 border-t border-black/10 pt-3">
        <div className="flex items-center justify-between text-xs text-inherit/80 mb-1">
          <span className="font-semibold text-sm text-inherit truncate max-w-[170px]">
            {letter.senderName || "Teman Rahasia"}
          </span>
          <time dateTime={letter.createdAt} className="text-[11px]">
            {dateFormatted}
          </time>
        </div>
        <p className="text-xs text-inherit/70 line-clamp-2 italic font-serif">
          &ldquo;{letter.content}&rdquo;
        </p>
      </div>

      {/* Attachments indicator footer */}
      <div className="mt-3 flex items-center gap-2 pt-2 border-t border-black/5 text-[11px] text-inherit/75">
        {hasImage && (
          <span className="inline-flex items-center gap-1 bg-black/5 px-2 py-0.5 rounded-md">
            <ImageIcon className="w-3 h-3" /> Foto
          </span>
        )}
        {hasAudio && (
          <span className="inline-flex items-center gap-1 bg-black/5 px-2 py-0.5 rounded-md">
            <Mic className="w-3 h-3" /> Suara
          </span>
        )}
        {!hasImage && !hasAudio && (
          <span className="text-[11px] text-inherit/50">Hanya pesan teks</span>
        )}
      </div>
    </div>
  );
}
