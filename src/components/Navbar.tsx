"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Mail, LogOut, User, Menu, X } from "lucide-react";

interface UserSession {
  id: string;
  username: string;
  displayName: string;
}

export default function Navbar() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/");
      router.refresh();
    } catch {
      // Refresh anyway
      router.push("/");
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FBF8F3]/95 backdrop-blur-xs border-b border-[#E8DEC8]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo & Brand */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-[#231F20] group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C85A32] rounded-md py-1"
        >
          <div className="w-9 h-9 rounded-full bg-[#9B2C2C] flex items-center justify-center text-white shadow-sm border border-[#771D1D] group-hover:scale-105 transition-transform">
            <Mail className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-xl tracking-tight text-[#231F20] leading-none">
              Warkat
            </span>
            <span className="text-[10px] tracking-wider uppercase text-[#736A65] font-sans">
              Surat Taktil
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex items-center gap-3" aria-label="Navigasi Utama">
          {!loading && user ? (
            <>
              <Link
                href="/dashboard"
                className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors min-h-[44px] ${
                  pathname === "/dashboard"
                    ? "bg-[#EDE2D0] text-[#231F20]"
                    : "text-[#544B46] hover:text-[#231F20] hover:bg-[#F2EADB]"
                }`}
              >
                <Mail className="w-4 h-4 text-[#9B2C2C]" />
                <span>Kotak Masuk</span>
              </Link>
              <div className="flex items-center gap-2 px-3 py-1.5 text-xs bg-[#F2ECE1] border border-[#E0D4C0] rounded-full text-[#4E4440]">
                <User className="w-3.5 h-3.5 text-[#736A65]" />
                <span className="font-medium truncate max-w-[120px]">
                  @{user.username}
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-[#736A65] hover:text-[#9B2C2C] hover:bg-[#FBEAEA] rounded-lg transition-colors min-h-[44px]"
                title="Keluar dari akun"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar</span>
              </button>
            </>
          ) : !loading ? (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-[#4E4440] hover:text-[#231F20] hover:bg-[#F2EADB] rounded-lg transition-colors min-h-[44px] flex items-center"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-medium text-white bg-[#9B2C2C] hover:bg-[#822121] active:bg-[#6D1B1B] rounded-lg shadow-sm border border-[#7A1F1F] transition-all min-h-[44px] flex items-center"
              >
                Buat Akun
              </Link>
            </>
          ) : null}
        </nav>

        {/* Mobile Menu Button */}
        <div className="sm:hidden flex items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-lg text-[#544B46] hover:text-[#231F20] hover:bg-[#F2EADB] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={mobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-[#E8DEC8] bg-[#FBF8F3] px-4 pt-3 pb-5 space-y-2">
          {!loading && user ? (
            <>
              <div className="px-3 py-2 text-xs text-[#736A65] bg-[#F2ECE1] rounded-lg">
                Masuk sebagai <strong className="text-[#231F20]">@{user.username}</strong>
              </div>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-[#231F20] hover:bg-[#F2EADB] rounded-lg min-h-[44px]"
              >
                <Mail className="w-4 h-4 text-[#9B2C2C]" />
                <span>Kotak Masuk Saya</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-[#9B2C2C] hover:bg-[#FBEAEA] rounded-lg min-h-[44px]"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar Akun</span>
              </button>
            </>
          ) : !loading ? (
            <>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-[#4E4440] hover:text-[#231F20] hover:bg-[#F2EADB] rounded-lg min-h-[44px]"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center px-4 py-2.5 text-sm font-medium text-white bg-[#9B2C2C] rounded-lg shadow-sm border border-[#7A1F1F] min-h-[44px]"
              >
                Buat Akun Baru
              </Link>
            </>
          ) : null}
        </div>
      )}
    </header>
  );
}
