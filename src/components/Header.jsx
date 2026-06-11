import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Send, ShieldCheck, BookMarked } from "lucide-react";
import { TELEGRAM_GROUP } from "../lib/constants.js";

const Header = () => {
    const { pathname } = useLocation();
    const isAdmin = pathname.startsWith("/admin");

    return (
        <header className="sticky top-0 z-40 backdrop-blur-md bg-stone-950/75 border-b border-stone-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2.5 group" data-testid="brand-link">
                    <div className="w-9 h-9 rounded-md bg-[#d4af37] flex items-center justify-center shadow-lg shadow-[#d4af37]/20">
                        <BookMarked size={18} className="text-stone-950" />
                    </div>
                    <div className="leading-tight">
                        <div className="font-serif text-xl text-stone-100 tracking-tight">
                            Readify<span className="text-[#d4af37]">BySam</span>
                        </div>
                        <div className="text-[10px] uppercase tracking-[0.25em] text-stone-500">
                            Competitive Exam Library
                        </div>
                    </div>
                </Link>

                <nav className="flex items-center gap-2 sm:gap-3">
                    <a
                        href={TELEGRAM_GROUP}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-testid="header-telegram-btn"
                        className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-stone-900 border border-stone-800 hover:border-[#d4af37]/40 hover:bg-stone-800 text-stone-300 text-xs font-medium transition-colors"
                    >
                        <Send size={14} className="text-[#229ED9]" />
                        Join Telegram Group
                    </a>
                    {isAdmin ? (
                        <Link
                            to="/"
                            data-testid="back-to-site-btn"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-stone-300 hover:text-stone-100 text-xs font-medium transition-colors"
                        >
                            Back to Library
                        </Link>
                    ) : (
                        <Link
                            to="/admin"
                            data-testid="admin-link"
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-stone-400 hover:text-[#d4af37] text-xs font-medium transition-colors"
                        >
                            <ShieldCheck size={14} />
                            <span className="hidden sm:inline">Admin</span>
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
