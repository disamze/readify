import React from "react";
import { paletteFor } from "../lib/constants";

// Generative typographic book cover — no images required
const BookCover = ({ title, author, subject, size = "md" }) => {
    const p = paletteFor(subject);
    const sizes = {
        sm: { wrap: "aspect-[2/3] text-[10px]", title: "text-sm", author: "text-[10px]" },
        md: { wrap: "aspect-[2/3]", title: "text-lg", author: "text-xs" },
        lg: { wrap: "aspect-[2/3]", title: "text-2xl", author: "text-sm" },
    };
    const s = sizes[size] || sizes.md;

    return (
        <div
            className={`book-spine relative w-full ${s.wrap} overflow-hidden rounded-sm shadow-2xl flex flex-col justify-between p-5 pl-7`}
            style={{
                background: `radial-gradient(circle at 75% 20%, ${p.glow}22 0%, transparent 55%), linear-gradient(135deg, ${p.bg} 0%, #0c0a09 130%)`,
                color: p.text,
            }}
            data-testid="book-cover"
        >
            {/* Top brand mark */}
            <div className="flex items-center justify-between font-sans tracking-widest uppercase opacity-70">
                <span className="text-[9px]" style={{ color: p.glow }}>
                    R · BS
                </span>
                <span className="text-[9px]">{subject}</span>
            </div>

            {/* Title block */}
            <div className="flex-1 flex flex-col justify-center -mt-2">
                <div
                    className={`font-serif font-semibold leading-tight tracking-tight ${s.title}`}
                    style={{ color: p.text }}
                >
                    {title}
                </div>
                <div
                    className={`mt-3 font-sans tracking-[0.25em] uppercase opacity-70 ${s.author}`}
                    style={{ color: p.glow }}
                >
                    {author}
                </div>
            </div>

            {/* Bottom rule */}
            <div className="flex items-end justify-between">
                <div
                    className="h-px flex-1 mr-3"
                    style={{ background: `linear-gradient(to right, ${p.glow}80, transparent)` }}
                />
                <span className="font-serif italic text-[10px] opacity-80">ReadifyBySam</span>
            </div>
        </div>
    );
};

export default BookCover;
