import React from "react";
import { Heart } from "lucide-react";
import BookCover from "./BookCover";
import { isFavorite, toggleFavorite, getProgress } from "../lib/storage";

const BookCard = ({ book, onOpen, onFavoriteChange }) => {
    const [fav, setFav] = React.useState(isFavorite(book.id));
    const progress = getProgress(book.id);

    const handleFav = (e) => {
        e.stopPropagation();
        toggleFavorite(book.id);
        const next = !fav;
        setFav(next);
        onFavoriteChange?.();
    };

    return (
        <div
            onClick={() => onOpen(book)}
            className="group relative flex flex-col gap-3 cursor-pointer fade-up"
            data-testid={`book-card-${book.id}`}
        >
            <div className="relative transition-transform duration-300 ease-out group-hover:-translate-y-1">
                <BookCover title={book.title} author={book.author} subject={book.subject} />
                <button
                    onClick={handleFav}
                    aria-label="favorite"
                    data-testid={`fav-btn-${book.id}`}
                    className="absolute top-2 right-2 z-10 w-9 h-9 rounded-full bg-black/55 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-black/80 transition-colors"
                >
                    <Heart
                        size={16}
                        className={fav ? "fill-[#d4af37] text-[#d4af37]" : "text-stone-300"}
                    />
                </button>
                {progress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-stone-900/70">
                        <div
                            className="h-full bg-[#d4af37] transition-all"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-1 px-1">
                <div className="text-stone-100 font-serif text-lg leading-tight line-clamp-2">
                    {book.title}
                </div>
                <div className="flex items-center justify-between gap-2 text-stone-500 text-xs">
                    <span className="truncate">{book.author}</span>
                    <span className="text-stone-600 shrink-0">{book.exam_type}</span>
                </div>
            </div>
        </div>
    );
};

export default BookCard;
