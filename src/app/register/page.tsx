"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, ArrowRight, AlertCircle } from "lucide-react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const prefill = searchParams.get("username");
    if (prefill) {
      setUsername(prefill.toLowerCase().replace(/[^a-z0-9_]/g, ""));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, displayName, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal membuat akun.");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan jaringan. Silakan coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-[#F7F2E8] rounded-2xl border border-[#D8C7AA] p-6 sm:p-8 paper-shadow">
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-full bg-[#9B2C2C] text-white flex items-center justify-center mx-auto mb-3 shadow-sm border border-[#7A1F1F]">
          <Mail className="w-6 h-6" />
        </div>
        <h1 className="font-serif font-bold text-2xl text-[#231F20]">
          Buat Akun Warkat
        </h1>
        <p className="mt-1 text-xs text-[#6B5E57]">
          Dapatkan tautan unikmu dan mulai kumpulkan surat rahasia berharga.
        </p>
      </div>

      {error && (
        <div className="mb-5 flex items-start gap-2.5 p-3 rounded-xl bg-[#FDEAEA] border border-[#F8B4B4] text-xs text-[#8A2121]">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="username"
            className="block text-xs font-semibold text-[#443831] mb-1.5"
          >
            Nama Pengguna (Link Publik)
          </label>
          <div className="flex items-center rounded-xl border border-[#CDBAA0] bg-[#FDFBF7] px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-[#C85A32] focus-within:border-transparent">
            <span className="text-xs text-[#8F7E74] select-none mr-1">
              warkat.me/u/
            </span>
            <input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) =>
                setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))
              }
              placeholder="alpin"
              className="w-full bg-transparent text-[#231F20] font-medium placeholder:text-[#AAA096] focus:outline-none"
            />
          </div>
          <span className="text-[10px] text-[#7A6D65] mt-1 block">
            Hanya huruf kecil, angka, dan garis bawah (_). Minimal 3 karakter.
          </span>
        </div>

        <div>
          <label
            htmlFor="displayName"
            className="block text-xs font-semibold text-[#443831] mb-1.5"
          >
            Nama Lengkap / Panggilan
          </label>
          <input
            id="displayName"
            type="text"
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Alpin Ardiansyah"
            className="w-full rounded-xl border border-[#CDBAA0] bg-[#FDFBF7] px-3.5 py-2.5 text-sm text-[#231F20] placeholder:text-[#AAA096] focus:outline-none focus:ring-2 focus:ring-[#C85A32]"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-xs font-semibold text-[#443831] mb-1.5"
          >
            Kata Sandi
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimal 6 karakter"
            className="w-full rounded-xl border border-[#CDBAA0] bg-[#FDFBF7] px-3.5 py-2.5 text-sm text-[#231F20] placeholder:text-[#AAA096] focus:outline-none focus:ring-2 focus:ring-[#C85A32]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-[#9B2C2C] hover:bg-[#822121] active:bg-[#6D1B1B] shadow-md transition-all min-h-[44px] disabled:opacity-60"
        >
          {loading ? (
            <span>Membuat akun...</span>
          ) : (
            <>
              <span>Daftar Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-4 border-t border-[#E2D5BF] text-center text-xs text-[#6B5E57]">
        Sudah memiliki akun Warkat?{" "}
        <Link
          href="/login"
          className="font-semibold text-[#9B2C2C] hover:underline min-h-[44px] inline-flex items-center"
        >
          Masuk di sini
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <Suspense fallback={<div className="text-xs text-[#736A65]">Memuat formulir...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
