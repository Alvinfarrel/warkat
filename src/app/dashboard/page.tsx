"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LetterItem, UserProfile } from "@/types";
import EnvelopeCard from "@/components/EnvelopeCard";
import LetterReaderModal from "@/components/LetterReaderModal";
import {
  Mail,
  Copy,
  Check,
  ExternalLink,
  Inbox,
  Star,
  RefreshCw,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [letters, setLetters] = useState<LetterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "favorite">("all");
  const [activeLetter, setActiveLetter] = useState<LetterItem | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const authRes = await fetch("/api/auth/me");
      if (!authRes.ok) {
        router.push("/login");
        return;
      }
      const authData = await authRes.json();
      if (!authData.user) {
        router.push("/login");
        return;
      }
      setUser(authData.user);

      const lettersRes = await fetch("/api/letters");
      if (lettersRes.ok) {
        const lettersData = await lettersRes.json();
        setLetters(lettersData.letters || []);
      }
    } catch {
      // Error fetching
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [router]);

  const handleCopyLink = () => {
    if (!user) return;
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const publicUrl = `${origin}/u/${user.username}`;
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleOpenLetter = async (letter: LetterItem) => {
    setActiveLetter(letter);

    // If letter is unread, mark it as read in backend
    if (!letter.isRead) {
      try {
        await fetch(`/api/letters/${letter.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isRead: true }),
        });

        setLetters((prev) =>
          prev.map((l) => (l.id === letter.id ? { ...l, isRead: true } : l))
        );
      } catch (err) {
        console.error("Failed to mark letter as read:", err);
      }
    }
  };

  const handleToggleFavorite = async (letterId: string, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;
      await fetch(`/api/letters/${letterId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFavorite: newStatus }),
      });

      setLetters((prev) =>
        prev.map((l) => (l.id === letterId ? { ...l, isFavorite: newStatus } : l))
      );

      if (activeLetter && activeLetter.id === letterId) {
        setActiveLetter((prev) => (prev ? { ...prev, isFavorite: newStatus } : null));
      }
    } catch (err) {
      console.error("Failed to update favorite status:", err);
    }
  };

  const handleDeleteLetter = async (letterId: string) => {
    const confirmDelete = window.confirm(
      "Apakah Anda yakin ingin menghapus surat ini secara permanen?"
    );
    if (!confirmDelete) return;

    try {
      await fetch(`/api/letters/${letterId}`, { method: "DELETE" });
      setLetters((prev) => prev.filter((l) => l.id !== letterId));
      setActiveLetter(null);
    } catch (err) {
      console.error("Failed to delete letter:", err);
    }
  };

  const unreadCount = letters.filter((l) => !l.isRead).length;
  const favoriteCount = letters.filter((l) => l.isFavorite).length;

  const filteredLetters = letters.filter((letter) => {
    if (activeTab === "unread") return !letter.isRead;
    if (activeTab === "favorite") return letter.isFavorite;
    return true;
  });

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-10 h-10 rounded-full border-2 border-[#9B2C2C] border-t-transparent animate-spin mb-3" />
        <p className="text-sm font-serif italic text-[#63564F]">
          Membuka lemari arsip surat Anda...
        </p>
      </div>
    );
  }

  if (!user) return null;

  const publicUrl = typeof window !== "undefined" ? `${window.location.origin}/u/${user.username}` : `/u/${user.username}`;

  return (
    <div className="flex-1 py-8 px-4 sm:px-6 max-w-5xl mx-auto w-full">
      {/* Top Banner: Public Link Sharing Card */}
      <div className="rounded-2xl border border-[#D5C2A4] bg-[#F7F2E8] p-5 sm:p-6 mb-8 paper-shadow">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#8B2222]">
              Tautan Surat Publik Anda
            </span>
            <h1 className="font-serif font-bold text-2xl text-[#231F20] mt-0.5">
              Kotak Surat @{user.username}
            </h1>
            <p className="text-xs text-[#61554E] mt-1">
              Sebarkan tautan ini ke bio Instagram, status WhatsApp, atau Twitter.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#9B2C2C] hover:bg-[#822121] text-white text-xs font-semibold shadow-sm transition-all min-h-[44px]"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Tautan Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Salin Tautan</span>
                </>
              )}
            </button>

            <a
              href={`/u/${user.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#C6B396] bg-[#EDE0CA] hover:bg-[#E2D2B8] text-[#3E3129] text-xs font-medium transition-colors min-h-[44px]"
            >
              <span>Buka Meja Tulis</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>
        </div>

        {/* Display bare URL */}
        <div className="mt-4 pt-3 border-t border-[#E5D7C1] flex items-center justify-between text-xs text-[#52453C]">
          <span className="font-mono bg-[#EFE6D4] px-2.5 py-1 rounded-md border border-[#DFCDB2] truncate max-w-full">
            {publicUrl}
          </span>
          <button
            type="button"
            onClick={() => {
              setRefreshing(true);
              fetchDashboardData();
            }}
            disabled={refreshing}
            className="flex items-center gap-1 text-[#8B2222] hover:underline text-xs min-h-[32px] px-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            <span>Perbarui</span>
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
        <div className="rounded-xl border border-[#DECDB5] bg-[#FDFBF7] p-4 text-center paper-shadow">
          <p className="text-xs text-[#7A6C63] font-medium">Total Surat</p>
          <p className="font-serif font-bold text-2xl sm:text-3xl text-[#231F20] mt-0.5">
            {letters.length}
          </p>
        </div>

        <div className="rounded-xl border border-[#DECDB5] bg-[#FDFBF7] p-4 text-center paper-shadow">
          <p className="text-xs text-[#7A6C63] font-medium">Belum Dibuka</p>
          <p className="font-serif font-bold text-2xl sm:text-3xl text-[#9B2C2C] mt-0.5">
            {unreadCount}
          </p>
        </div>

        <div className="rounded-xl border border-[#DECDB5] bg-[#FDFBF7] p-4 text-center paper-shadow">
          <p className="text-xs text-[#7A6C63] font-medium">Favorit</p>
          <p className="font-serif font-bold text-2xl sm:text-3xl text-[#D97706] mt-0.5">
            {favoriteCount}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-[#E2D5BE] pb-3 mb-6">
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors min-h-[44px] ${
              activeTab === "all"
                ? "bg-[#9B2C2C] text-white shadow-xs"
                : "text-[#5E5149] hover:bg-[#EFE6D4]"
            }`}
          >
            Semua ({letters.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("unread")}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors min-h-[44px] ${
              activeTab === "unread"
                ? "bg-[#9B2C2C] text-white shadow-xs"
                : "text-[#5E5149] hover:bg-[#EFE6D4]"
            }`}
          >
            Belum Dibuka ({unreadCount})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("favorite")}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors min-h-[44px] ${
              activeTab === "favorite"
                ? "bg-[#9B2C2C] text-white shadow-xs"
                : "text-[#5E5149] hover:bg-[#EFE6D4]"
            }`}
          >
            Favorit ({favoriteCount})
          </button>
        </div>
      </div>

      {/* Letters Grid or Empty State */}
      {filteredLetters.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#D2BF9E] bg-[#F7F2E8]/60 p-12 text-center my-6">
          <div className="w-14 h-14 rounded-full bg-[#EDE0CA] text-[#78695E] flex items-center justify-center mx-auto mb-4">
            {activeTab === "favorite" ? (
              <Star className="w-7 h-7" />
            ) : (
              <Inbox className="w-7 h-7" />
            )}
          </div>
          <h2 className="font-serif text-xl font-bold text-[#231F20]">
            {activeTab === "unread"
              ? "Semua amplop telah Anda buka."
              : activeTab === "favorite"
              ? "Belum ada surat yang ditandai sebagai favorit."
              : "Kotak surat Anda masih kosong."}
          </h2>
          <p className="mt-1.5 text-xs text-[#6B5E57] max-w-sm mx-auto leading-relaxed">
            {activeTab === "all"
              ? "Sebarkan tautan warkatmu ke teman atau media sosial untuk mulai menerima surat anonim berharga."
              : "Semua surat yang sesuai dengan kriteria filter akan muncul di sini."}
          </p>

          {activeTab === "all" && (
            <button
              type="button"
              onClick={handleCopyLink}
              className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#9B2C2C] text-white text-xs font-semibold hover:bg-[#822121] shadow-sm min-h-[44px]"
            >
              <Copy className="w-4 h-4" />
              <span>Salin Tautan Surat Anda</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLetters.map((letter) => (
            <EnvelopeCard
              key={letter.id}
              letter={letter}
              onClick={() => handleOpenLetter(letter)}
              onToggleFavorite={(e) => {
                e.stopPropagation();
                handleToggleFavorite(letter.id, letter.isFavorite);
              }}
            />
          ))}
        </div>
      )}

      {/* Reader Modal */}
      {activeLetter && (
        <LetterReaderModal
          letter={activeLetter}
          recipientUsername={user.username}
          onClose={() => setActiveLetter(null)}
          onToggleFavorite={() =>
            handleToggleFavorite(activeLetter.id, activeLetter.isFavorite)
          }
          onDelete={() => handleDeleteLetter(activeLetter.id)}
        />
      )}
    </div>
  );
}
