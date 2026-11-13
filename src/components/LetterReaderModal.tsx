"use client";

import { useEffect, useState, useRef } from "react";
import { LetterItem } from "@/types";
import { getPreset } from "@/lib/presets";
import StoryExporter from "./StoryExporter";
import {
  X,
  Star,
  Trash2,
  Share2,
  Play,
  Pause,
  RotateCcw,
  Image as ImageIcon,
  Check,
} from "lucide-react";

interface LetterReaderModalProps {
  letter: LetterItem;
  recipientUsername: string;
  onClose: () => void;
  onToggleFavorite: () => void;
  onDelete: () => void;
}

export default function LetterReaderModal({
  letter,
  recipientUsername,
  onClose,
  onToggleFavorite,
  onDelete,
}: LetterReaderModalProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [showStoryExporter, setShowStoryExporter] = useState(false);
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const preset = getPreset(letter.presetStyle);

  const imageAttachment = letter.attachments.find((a) => a.type === "IMAGE");
  const audioAttachment = letter.attachments.find((a) => a.type === "AUDIO");

  const dateFormatted = new Date(letter.createdAt).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (zoomImage) {
          setZoomImage(null);
        } else if (showStoryExporter) {
          setShowStoryExporter(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, zoomImage, showStoryExporter]);

  const togglePlayAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  const handleAudioTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const duration = audioRef.current.duration || 1;
    setAudioProgress((current / duration) * 100);
  };

  const handleAudioLoadedMetadata = () => {
    if (!audioRef.current) return;
    setAudioDuration(audioRef.current.duration);
  };

  const replayAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play();
    setIsPlayingAudio(true);
  };

  const formatAudioTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "00:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Membaca surat dari ${letter.senderName || "Teman Rahasia"}`}
        className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs overflow-y-auto"
      >
        <div className="relative w-full max-w-xl my-8 transition-all animate-in fade-in zoom-in-95 duration-200">
          {/* Main Paper Container */}
          <div
            className={`rounded-2xl border p-6 sm:p-8 shadow-2xl relative overflow-hidden ${
              preset.paperBg
            } ${preset.paperBorder} ${preset.paperText}`}
          >
            {/* Top Seal Stamp & Close Button */}
            <div className="flex items-center justify-between pb-4 border-b border-black/10">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md border-2 font-serif font-black text-sm ${
                    preset.sealColor
                  }`}
                >
                  W
                </div>
                <div>
                  <span className="text-[11px] font-sans uppercase tracking-widest opacity-60">
                    {preset.name}
                  </span>
                  <p className="text-xs font-sans opacity-75">{dateFormatted}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={onToggleFavorite}
                  className={`p-2 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
                    letter.isFavorite
                      ? "text-[#D97706] hover:bg-amber-100/50"
                      : "opacity-60 hover:opacity-100 hover:bg-black/5"
                  }`}
                  title={letter.isFavorite ? "Hapus dari favorit" : "Tandai favorit"}
                  aria-label={letter.isFavorite ? "Hapus dari favorit" : "Tandai favorit"}
                >
                  <Star className={`w-5 h-5 ${letter.isFavorite ? "fill-current" : ""}`} />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 opacity-60 hover:opacity-100 hover:bg-black/5 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Tutup surat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Sender Heading */}
            <div className="mt-6 mb-4">
              <p className="text-xs uppercase tracking-wider font-sans opacity-60">
                Pesan Dari:
              </p>
              <h2 className={`text-xl font-bold font-serif mt-0.5 ${preset.paperText}`}>
                {letter.senderName || "Teman Rahasia"}
              </h2>
            </div>

            {/* Letter Body Text */}
            <div className="my-6">
              <p
                className={`text-base sm:text-lg leading-relaxed whitespace-pre-wrap font-serif ${
                  preset.paperText
                }`}
              >
                {letter.content}
              </p>
            </div>

            {/* Attached Photo Preview */}
            {imageAttachment && (
              <div className="my-5 p-3 rounded-xl border border-black/10 bg-black/5">
                <p className="text-xs font-sans font-semibold mb-2 flex items-center gap-1.5 opacity-75">
                  <ImageIcon className="w-3.5 h-3.5" />
                  Foto Lampiran (Klik untuk memperbesar)
                </p>
                <div
                  onClick={() => setZoomImage(imageAttachment.fileUrl)}
                  className="cursor-pointer group relative overflow-hidden rounded-lg max-h-72 flex items-center justify-center bg-black/10"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageAttachment.fileUrl}
                    alt="Foto kenangan lampiran"
                    className="w-full h-auto max-h-72 object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
                    Klik untuk memperbesar
                  </div>
                </div>
              </div>
            )}

            {/* Attached Audio Player */}
            {audioAttachment && (
              <div className="my-5 p-4 rounded-xl border border-black/10 bg-black/5">
                <p className="text-xs font-sans font-semibold mb-2 opacity-75">
                  Lampiran Pesan Suara
                </p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={togglePlayAudio}
                    className="w-12 h-12 rounded-full bg-[#9B2C2C] text-white flex items-center justify-center hover:bg-[#822121] active:scale-95 transition-transform shadow-md"
                    aria-label={isPlayingAudio ? "Jeda rekaman" : "Putar rekaman suara"}
                  >
                    {isPlayingAudio ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5 ml-0.5" />
                    )}
                  </button>

                  <div className="flex-1">
                    <div className="w-full bg-black/10 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#9B2C2C] h-full transition-all duration-150"
                        style={{ width: `${audioProgress}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[11px] opacity-70 mt-1 font-mono">
                      <span>
                        {formatAudioTime(audioRef.current?.currentTime || 0)}
                      </span>
                      <span>{formatAudioTime(audioDuration)}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={replayAudio}
                    className="p-2 opacity-60 hover:opacity-100 hover:bg-black/5 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                    title="Ulangi dari awal"
                    aria-label="Putar ulang suara dari awal"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                <audio
                  ref={audioRef}
                  src={audioAttachment.fileUrl}
                  onTimeUpdate={handleAudioTimeUpdate}
                  onLoadedMetadata={handleAudioLoadedMetadata}
                  onEnded={() => {
                    setIsPlayingAudio(false);
                    setAudioProgress(0);
                  }}
                  className="hidden"
                />
              </div>
            )}

            {/* Bottom Actions Toolbar */}
            <div className="mt-8 pt-4 border-t border-black/10 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setShowStoryExporter(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#9B2C2C] hover:bg-[#822121] shadow-sm transition-all min-h-[44px]"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Bagikan ke Story</span>
              </button>

              <button
                type="button"
                onClick={onDelete}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-700 hover:text-red-800 hover:bg-red-100/50 rounded-lg transition-colors min-h-[44px]"
                title="Hapus surat ini secara permanen"
              >
                <Trash2 className="w-4 h-4" />
                <span>Hapus Surat</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Photo Lightbox */}
      {zoomImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Tampilan penuh foto lampiran"
          className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setZoomImage(null)}
        >
          <button
            type="button"
            onClick={() => setZoomImage(null)}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/20 rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Tutup gambar"
          >
            <X className="w-6 h-6" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={zoomImage}
            alt="Perbesaran foto lampiran"
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}

      {/* Instagram Story Exporter Modal */}
      {showStoryExporter && (
        <StoryExporter
          letter={letter}
          recipientUsername={recipientUsername}
          onClose={() => setShowStoryExporter(false)}
        />
      )}
    </>
  );
}
