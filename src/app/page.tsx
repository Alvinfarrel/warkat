"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Mic, Image as ImageIcon, Share2, ArrowRight } from "lucide-react";
import { LETTER_PRESETS } from "@/lib/presets";

export default function HomePage() {
  const [claimUsername, setClaimUsername] = useState("");
  const router = useRouter();

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = claimUsername.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
    if (clean) {
      router.push(`/register?username=${encodeURIComponent(clean)}`);
    } else {
      router.push("/register");
    }
  };

  const samplePresets = Object.values(LETTER_PRESETS).slice(0, 3);

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-6 max-w-5xl mx-auto w-full text-center">
        {/* Category tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDE2CE] border border-[#D8C7AA] text-xs font-semibold text-[#54433A] mb-6">
          <Mail className="w-3.5 h-3.5 text-[#9B2C2C]" />
          <span>Platform Surat Anonim Interaktif</span>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#231F20] tracking-tight leading-[1.15] max-w-3xl mx-auto">
          Kirim dan simpan surat rahasia dalam amplop berstempel lilin.
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-base sm:text-lg text-[#5E524C] max-w-2xl mx-auto leading-relaxed">
          Bagikan tautan pribadimu ke teman atau media sosial. Biarkan mereka
          mengirimkan pesan tulus, memilih tema kertas fisik, melampirkan foto,
          dan merekam pesan suara langsung.
        </p>

        {/* Claim Username Box */}
        <div className="mt-8 sm:mt-10 max-w-md mx-auto">
          <form
            onSubmit={handleClaimSubmit}
            className="flex flex-col sm:flex-row items-center gap-2 bg-[#F3ECE0] p-2 rounded-2xl border border-[#D5C2A5] shadow-md"
          >
            <div className="flex items-center flex-1 w-full px-3 py-2 text-sm text-[#4E4138]">
              <span className="font-mono text-xs opacity-60 select-none">
                warkat.me/u/
              </span>
              <input
                type="text"
                placeholder="nama-kamu"
                value={claimUsername}
                onChange={(e) => setClaimUsername(e.target.value)}
                className="w-full bg-transparent px-1 font-medium text-[#231F20] placeholder:text-[#9A8D83] focus:outline-none"
                aria-label="Klaim nama pengguna unik"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl bg-[#9B2C2C] text-white font-medium text-sm hover:bg-[#822121] shadow-sm transition-all min-h-[44px]"
            >
              <span>Klaim Link</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          <p className="mt-2 text-xs text-[#7A6C63]">
            Gratis dan langsung dapat dibagikan ke Instagram, Twitter, atau WhatsApp.
          </p>
        </div>
      </section>

      {/* Visual Envelope Gallery Showcase */}
      <section className="py-12 px-4 sm:px-6 bg-[#F3ECE0]/70 border-y border-[#E2D5BE]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#231F20]">
              Pilihan Bentuk Surat Tematik
            </h2>
            <p className="mt-2 text-sm text-[#61554E] max-w-xl mx-auto">
              Pengirim dapat memilih gaya amplop dan kertas yang sesuai dengan isi
              pesan mereka.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {samplePresets.map((preset) => (
              <div
                key={preset.id}
                className={`rounded-2xl border p-6 flex flex-col justify-between envelope-shadow relative overflow-hidden ${preset.envelopeColor} ${preset.envelopeBorder}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/10 text-inherit">
                      {preset.badgeText}
                    </span>
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-serif font-black shadow-xs border ${preset.sealColor}`}
                    >
                      W
                    </div>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-inherit">
                    {preset.name}
                  </h3>
                  <p className="mt-2 text-xs text-inherit/80 leading-relaxed">
                    {preset.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-black/10 flex items-center justify-between text-xs text-inherit/70">
                  <span className="italic font-serif">{preset.tagline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Narrative Section */}
      <section className="py-16 px-4 sm:px-6 max-w-5xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#231F20]">
            Bukan Sekadar Pesan Anonim Biasa
          </h2>
          <p className="mt-2 text-sm text-[#665A53] max-w-xl mx-auto">
            Dirancang dengan perhatian khusus pada rasa taktil dan kehangatan
            korespondensi nyata.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-[#DECDB5] bg-[#F7F2E8] p-6 paper-shadow">
            <div className="w-10 h-10 rounded-xl bg-[#EDE0CA] flex items-center justify-center text-[#9B2C2C] mb-4">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-[#231F20]">
              Nama Opsional & Rahasia
            </h3>
            <p className="mt-2 text-xs text-[#5D5048] leading-relaxed">
              Pengirim dapat memilih menjadi teman rahasia sejati atau mencantumkan
              nama samaran yang hanya diketahui kalian berdua.
            </p>
          </div>

          <div className="rounded-2xl border border-[#DECDB5] bg-[#F7F2E8] p-6 paper-shadow">
            <div className="w-10 h-10 rounded-xl bg-[#EDE0CA] flex items-center justify-center text-[#9B2C2C] mb-4">
              <Mic className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-[#231F20]">
              Rekaman Suara & Foto
            </h3>
            <p className="mt-2 text-xs text-[#5D5048] leading-relaxed">
              Dengarkan nada bicara langsung dari pengirim dengan fitur voice note
              terintegrasi serta sisipan foto kenangan.
            </p>
          </div>

          <div className="rounded-2xl border border-[#DECDB5] bg-[#F7F2E8] p-6 paper-shadow">
            <div className="w-10 h-10 rounded-xl bg-[#EDE0CA] flex items-center justify-center text-[#9B2C2C] mb-4">
              <Share2 className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-[#231F20]">
              Bagikan ke Instagram Story
            </h3>
            <p className="mt-2 text-xs text-[#5D5048] leading-relaxed">
              Satu klik untuk mengunduh kartu surat berkualitas tinggi berformat
              9:16 yang siap diunggah ke story media sosial.
            </p>
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-14 rounded-2xl bg-[#231F20] text-[#F5EFEB] p-8 sm:p-10 text-center relative overflow-hidden shadow-xl">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">
            Siap membuka kotak suratmu hari ini?
          </h2>
          <p className="mt-2 text-sm text-[#BDB2AA] max-w-lg mx-auto">
            Daftar dalam waktu kurang dari satu menit dan dapatkan tautan warkat
            pribadimu sekarang juga.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/register"
              className="px-6 py-3 rounded-xl bg-[#9B2C2C] text-white text-sm font-semibold hover:bg-[#822121] shadow-md transition-all min-h-[44px] flex items-center"
            >
              Mulai Buat Akun
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 rounded-xl bg-[#3B3436] text-[#F5EFEB] text-sm font-semibold hover:bg-[#4E4447] transition-all min-h-[44px] flex items-center"
            >
              Sudah Punya Akun? Masuk
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
