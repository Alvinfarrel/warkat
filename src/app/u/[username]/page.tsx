"use client";

import { use, useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { UserProfile } from "@/types";
import { getPreset } from "@/lib/presets";
import LetterStylePicker from "@/components/LetterStylePicker";
import VoiceRecorder from "@/components/VoiceRecorder";
import {
  Mail,
  Send,
  Image as ImageIcon,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

function PublicLetterContent({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Form State
  const [selectedStyle, setSelectedStyle] = useState("vintage");
  const [senderName, setSenderName] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioDuration, setAudioDuration] = useState<number | undefined>(undefined);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const preset = getPreset(selectedStyle);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`/api/user/${encodeURIComponent(username)}`);
        if (!res.ok) {
          if (res.status === 404) setNotFound(true);
          else setErrorMsg("Gagal memuat penerima surat.");
          return;
        }
        const data = await res.json();
        setProfile(data.user);
      } catch {
        setErrorMsg("Terjadi gangguan saat memuat data.");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [username]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Ukuran foto maksimal 5 MB.");
      return;
    }

    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  };

  const removeImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleAudioChange = (file: File | null, duration?: number) => {
    setAudioFile(file);
    setAudioDuration(duration);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setErrorMsg("Pesan surat tidak boleh kosong.");
      return;
    }

    setErrorMsg(null);
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("username", username);
      if (senderName.trim()) {
        formData.append("senderName", senderName.trim());
      }
      formData.append("content", content.trim());
      formData.append("presetStyle", selectedStyle);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (audioFile) {
        formData.append("audio", audioFile);
        if (audioDuration) {
          formData.append("audioDuration", audioDuration.toString());
        }
      }

      const res = await fetch("/api/letters", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Gagal mengirim surat.");
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
    } catch {
      setErrorMsg("Terjadi kesalahan jaringan saat mengirim.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setContent("");
    setSenderName("");
    removeImage();
    setAudioFile(null);
    setAudioDuration(undefined);
    setSubmitted(false);
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-10 h-10 rounded-full border-2 border-[#9B2C2C] border-t-transparent animate-spin mb-3" />
        <p className="text-sm font-serif italic text-[#63564F]">
          Mempersiapkan meja tulis warkat...
        </p>
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-md mx-auto text-center">
        <div className="w-14 h-14 rounded-full bg-[#EDE2CE] text-[#736357] flex items-center justify-center mb-4">
          <Mail className="w-7 h-7" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-[#231F20]">
          Penerima Tidak Ditemukan
        </h1>
        <p className="mt-2 text-xs text-[#6B5E57] leading-relaxed">
          Akun dengan nama pengguna <strong>@{username}</strong> belum terdaftar
          di Warkat atau tautan yang Anda tuju keliru.
        </p>
        <Link
          href="/"
          className="mt-6 px-5 py-2.5 rounded-xl bg-[#9B2C2C] text-white text-xs font-semibold hover:bg-[#822121] transition-all min-h-[44px] flex items-center"
        >
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#F7F2E8] rounded-2xl border border-[#D8C7AA] p-8 text-center paper-shadow">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-4 border border-emerald-300">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="font-serif font-bold text-2xl text-[#231F20]">
            Surat Berhasil Disegel!
          </h1>
          <p className="mt-2 text-xs text-[#6B5E57] leading-relaxed">
            Pesan dan lampiranmu telah tersimpan rapi di dalam amplop{" "}
            <strong>{preset.name}</strong> dan siap dibuka oleh{" "}
            <strong>{profile.displayName}</strong>.
          </p>

          <div className="my-6 p-4 rounded-xl bg-[#EFE6D4] border border-[#D5C2A4] text-xs text-[#52443C] italic font-serif">
            &ldquo;Surat telah masuk ke dalam kotak penerima dengan aman.&rdquo;
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={resetForm}
              className="w-full py-3 px-4 rounded-xl bg-[#9B2C2C] text-white text-xs font-semibold hover:bg-[#822121] transition-all min-h-[44px]"
            >
              Tulis Surat Lain untuk @{username}
            </button>
            <Link
              href="/register"
              className="w-full py-3 px-4 rounded-xl border border-[#C5B396] bg-transparent text-[#44372F] text-xs font-semibold hover:bg-[#EAE0CD] transition-all min-h-[44px] flex items-center justify-center"
            >
              Buat Kotak Surat Warkat Milikmu Sendiri
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 py-8 px-4 sm:px-6 max-w-3xl mx-auto w-full">
      {/* Recipient Card Banner */}
      <div className="rounded-2xl border border-[#D8C7AA] bg-[#F7F2E8] p-5 sm:p-6 mb-8 paper-shadow flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
        <div className="w-16 h-16 rounded-full bg-[#9B2C2C] text-white flex items-center justify-center font-serif font-black text-2xl shadow-md border-2 border-[#7A1F1F] shrink-0">
          {profile.displayName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="font-serif font-bold text-xl sm:text-2xl text-[#231F20]">
              {profile.displayName}
            </h1>
            <span className="text-xs text-[#7A6E65] font-mono">
              @{profile.username}
            </span>
          </div>
          <p className="mt-1 text-xs text-[#63554D] leading-relaxed">
            {profile.bio ||
              "Tinggalkan surat rahasia, kenangan, atau sepatah kata hangat untukku."}
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 flex items-start gap-2.5 p-3.5 rounded-xl bg-[#FDEAEA] border border-[#F8B4B4] text-xs text-[#8A2121]">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Style Preset Picker */}
        <div className="rounded-2xl border border-[#DECDB5] bg-[#FDFBF7] p-5 paper-shadow">
          <LetterStylePicker
            selectedStyle={selectedStyle}
            onSelectStyle={setSelectedStyle}
          />
        </div>

        {/* Step 2: The Letter Writing Sheet */}
        <div
          className={`rounded-2xl border p-5 sm:p-8 paper-shadow transition-all ${preset.paperBg} ${preset.paperBorder}`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-black/10 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-sans font-semibold uppercase tracking-wider opacity-60">
                Lembaran Surat
              </span>
              <span className="text-xs opacity-40 font-serif">·</span>
              <span className="text-xs font-serif italic opacity-75">
                {preset.name}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] opacity-60 font-mono">
              <span>{content.length} / 5000</span>
            </div>
          </div>

          {/* Sender Name Field */}
          <div className="mb-4">
            <label
              htmlFor="senderName"
              className="block text-xs font-sans font-semibold uppercase tracking-wider opacity-70 mb-1"
            >
              Dari (Nama atau Julukan)
            </label>
            <input
              id="senderName"
              type="text"
              maxLength={60}
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="Kosongkan jika ingin menjadi Teman Rahasia (Anonim)"
              className="w-full bg-black/5 rounded-xl border border-black/10 px-3.5 py-2 text-sm placeholder:opacity-40 focus:outline-none focus:ring-2 focus:ring-[#C85A32] text-inherit"
            />
          </div>

          {/* Message Textarea */}
          <div className="mb-4">
            <label
              htmlFor="letterContent"
              className="block text-xs font-sans font-semibold uppercase tracking-wider opacity-70 mb-1"
            >
              Isi Pesan Surat
            </label>
            <textarea
              id="letterContent"
              required
              rows={7}
              maxLength={5000}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tuliskan kata-kata yang ingin kamu sampaikan dengan tulus..."
              className={`w-full bg-transparent rounded-xl border border-black/10 p-3.5 text-base sm:text-lg leading-relaxed placeholder:opacity-35 focus:outline-none focus:ring-2 focus:ring-[#C85A32] ${preset.fontFamily} ${preset.paperText}`}
            />
          </div>

          {/* Photo Attachment Field */}
          <div className="mb-5 pt-3 border-t border-black/10">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-sans font-semibold opacity-70 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Lampiran Foto (Opsional)</span>
              </label>
              <span className="text-[11px] opacity-50">JPG, PNG, WebP (Max 5MB)</span>
            </div>

            {imagePreview ? (
              <div className="relative inline-block rounded-xl overflow-hidden border border-black/10 bg-black/5 p-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="Pratinjau lampiran"
                  className="w-40 h-28 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-black/70 hover:bg-black text-white rounded-full transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center"
                  aria-label="Hapus foto lampiran"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg border border-dashed border-black/20 hover:bg-black/5 transition-colors min-h-[44px]">
                <ImageIcon className="w-4 h-4 opacity-70" />
                <span>Pilih Foto dari Galeri</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Voice Note Attachment */}
          <div className="pt-2">
            <VoiceRecorder onAudioChange={handleAudioChange} />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting || !content.trim()}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl text-sm font-semibold text-white bg-[#9B2C2C] hover:bg-[#822121] active:bg-[#6D1B1B] shadow-lg transition-all min-h-[44px] disabled:opacity-50"
        >
          {submitting ? (
            <span>Sedang menyegel amplop dan mengirim...</span>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Segel & Kirim Surat untuk {profile.displayName}</span>
              <Send className="w-4 h-4 ml-1" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default function PublicLetterPage(props: {
  params: Promise<{ username: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-10 h-10 rounded-full border-2 border-[#9B2C2C] border-t-transparent animate-spin mb-3" />
          <p className="text-sm font-serif italic text-[#63564F]">
            Mempersiapkan meja tulis warkat...
          </p>
        </div>
      }
    >
      <PublicLetterContent params={props.params} />
    </Suspense>
  );
}
