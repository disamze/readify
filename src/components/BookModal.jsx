import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { Slider } from "../components/ui/slider";
import { Button } from "../components/ui/button";
import { Heart, ExternalLink, BookOpen } from "lucide-react";
import BookCover from "./BookCover";
import {
    isFavorite,
    toggleFavorite,
    getProgress,
    setProgress,
    markLastRead,
} from "../lib/storage";

const BookModal = ({ book, open, onClose, onChange }) => {
    const [fav, setFav] = useState(false);
    const [progress, setProg] = useState(0);

    useEffect(() => {
        if (book) {
            setFav(isFavorite(book.id));
            setProg(getProgress(book.id));
        }
    }, [book]);

    if (!book) return null;

    const onFav = () => {
        toggleFavorite(book.id);
        setFav((v) => !v);
        onChange?.();
    };

    const onProgChange = (vals) => {
        const v = vals[0];
        setProg(v);
        setProgress(book.id, v);
        onChange?.();
    };

    const onRead = () => {
        markLastRead(book.id);
        if (progress === 0) {
            setProgress(book.id, 5);
            setProg(5);
        }
        onChange?.();
        window.open(book.telegram_link, "_blank", "noopener,noreferrer");
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent
                className="max-w-3xl bg-stone-950 border-stone-800 text-stone-100 p-0 overflow-hidden"
                data-testid="book-modal"
            >
                <DialogTitle className="sr-only">{book.title}</DialogTitle>
                <DialogDescription className="sr-only">Book detail</DialogDescription>
                <div className="grid md:grid-cols-[260px_1fr] gap-0">
                    <div className="p-6 bg-stone-900/40 flex items-start justify-center">
                        <div className="w-[200px]">
                            <BookCover
                                title={book.title}
                                author={book.author}
                                subject={book.subject}
                                size="md"
                            />
                        </div>
                    </div>
                    <div className="p-7 flex flex-col gap-5">
                        <div>
                            <div className="flex flex-wrap gap-2 mb-3">
                                <span className="text-[10px] uppercase tracking-widest px-2 py-1 rounded-full bg-stone-800/80 text-stone-300">
                                    {book.subject}
                                </span>
                                <span className="text-[10px] uppercase tracking-widest px-2 py-1 rounded-full bg-[#d4af37]/15 text-[#d4af37]">
                                    {book.exam_type}
                                </span>
                            </div>
                            <h2 className="font-serif text-3xl md:text-4xl leading-tight text-stone-50">
                                {book.title}
                            </h2>
                            <p className="mt-1 text-stone-400 text-sm tracking-wide">
                                by {book.author}
                            </p>
                        </div>

                        {book.description && (
                            <p className="text-stone-400 text-sm leading-relaxed">
                                {book.description}
                            </p>
                        )}

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs uppercase tracking-widest text-stone-500">
                                    Reading progress
                                </span>
                                <span className="text-[#d4af37] font-semibold text-sm">
                                    {progress}%
                                </span>
                            </div>
                            <Slider
                                value={[progress]}
                                onValueChange={onProgChange}
                                max={100}
                                step={1}
                                data-testid="progress-slider"
                                className="[&_[role=slider]]:bg-[#d4af37] [&_[role=slider]]:border-[#d4af37]"
                            />
                        </div>

                        <div className="flex flex-wrap gap-3 pt-2">
                            <Button
                                onClick={onRead}
                                data-testid="read-on-telegram-btn"
                                className="bg-[#d4af37] hover:bg-[#facc15] text-stone-950 font-semibold gap-2"
                            >
                                <BookOpen size={16} />
                                Read on Telegram
                                <ExternalLink size={14} />
                            </Button>
                            <Button
                                onClick={onFav}
                                variant="outline"
                                data-testid="modal-fav-btn"
                                className="border-stone-700 bg-stone-900 hover:bg-stone-800 text-stone-200 gap-2"
                            >
                                <Heart
                                    size={16}
                                    className={fav ? "fill-[#d4af37] text-[#d4af37]" : ""}
                                />
                                {fav ? "Favorited" : "Add to Favorites"}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default BookModal;
