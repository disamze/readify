import React from "react";
import { Send, Heart } from "lucide-react";
import { TELEGRAM_GROUP } from "../lib/constants";

const Footer = () => (
    <footer className="border-t border-stone-900 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid md:grid-cols-3 gap-10">
            <div>
                <div className="font-serif text-2xl text-stone-100">
                    Readify<span className="text-[#d4af37]">BySam</span>
                </div>
                <p className="mt-2 text-stone-500 text-sm max-w-xs leading-relaxed">
                    A curated index of competitive exam books. Tap a book and you&apos;re whisked away to
                    the exact PDF inside our Telegram library.
                </p>
            </div>
            <div>
                <div className="font-serif text-2xl text-stone-100">
                    Contact<span className="text-[#d4af37]">Us</span>
                </div>
                <p className="mt-2 text-stone-500 text-sm max-w-xs leading-relaxed">
                    If you want some other book that is not available in our library, please let us know by joining our Telegram group. We will try to add it as soon as possible.
                </p>
            </div>
            <div>
                <div className="text-xs uppercase tracking-[0.25em] text-stone-500 mb-3">
                    Library
                </div>
                <a
                    href={TELEGRAM_GROUP}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="footer-telegram-btn"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#229ED9] hover:bg-[#1c8bc0] text-white text-sm font-semibold transition-colors"
                >
                    <Send size={14} />
                    Open Telegram Group
                </a>
                <a
                    href={TELEGRAM_GROUP}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="footer-telegram-btn"
                    className="inline-flex mt-5 items-center gap-2 px-4 py-2.5 rounded-md bg-[#229ED9] hover:bg-[#1c8bc0] text-white text-sm font-semibold transition-colors"
                >
                    <Send size={14} />
                    Open 2nd Telegram Group
                </a>
            </div>
            <div className="text-stone-500 pr-4 text-lg md:text-right flex md:items-end md:justify-end">
                <span className="inline-flex items-center gap-1.5">
                    Built with <Heart size={12} className="text-[#d4af37] fill-[#d4af37]" /> for
                    learners.
                </span>
            </div>
        </div>
    </footer>
);

export default Footer;
