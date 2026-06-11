import React, { useEffect, useMemo, useState } from "react";
import { Search, Send, Library, Bookmark, Clock, Sparkles } from "lucide-react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import BookCard from "../components/BookCard.jsx";
import BookModal from "../components/BookModal.jsx";
import { Input } from "../components/ui/input.jsx";
import { fetchBooks } from "../lib/api.js";
import { SUBJECTS, EXAM_TYPES, TELEGRAM_GROUP } from "../lib/constants.js";
import { getFavorites, getLastRead } from "../lib/storage.js";

const FilterPill = ({ active, onClick, children, testId }) => (
    <button
        onClick={onClick}
        data-testid={testId}
        className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-colors whitespace-nowrap ${
            active
                ? "bg-[#d4af37] text-stone-950 border border-[#d4af37]"
                : "bg-stone-900 text-stone-400 border border-stone-800 hover:text-stone-200 hover:border-stone-600"
        }`}
    >
        {children}
    </button>
);

const HomePage = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [subject, setSubject] = useState("All");
    const [exam, setExam] = useState("All");
    const [view, setView] = useState("all"); // all | favorites | continue
    const [openBook, setOpenBook] = useState(null);
    const [tick, setTick] = useState(0); // force re-render after fav/progress change

    const refresh = () => setTick((t) => t + 1);

    useEffect(() => {
        fetchBooks()
            .then(setBooks)
            .finally(() => setLoading(false));
    }, []);

    const favorites = useMemo(() => getFavorites(), [tick]);
    const lastReadIds = useMemo(() => getLastRead().map((x) => x.id), [tick]);

    const filtered = useMemo(() => {
        let list = books;
        if (view === "favorites") list = list.filter((b) => favorites.includes(b.id));
        if (view === "continue") {
            const order = new Map(lastReadIds.map((id, i) => [id, i]));
            list = list
                .filter((b) => order.has(b.id))
                .sort((a, b) => order.get(a.id) - order.get(b.id));
        }
        if (subject !== "All") list = list.filter((b) => b.subject === subject);
        if (exam !== "All") list = list.filter((b) => b.exam_type === exam);
        if (query.trim()) {
            const q = query.toLowerCase();
            list = list.filter(
                (b) =>
                    b.title.toLowerCase().includes(q) ||
                    b.author.toLowerCase().includes(q) ||
                    (b.description || "").toLowerCase().includes(q),
            );
        }
        return list;
    }, [books, view, favorites, lastReadIds, subject, exam, query]);

    const continueBooks = useMemo(() => {
        if (lastReadIds.length === 0) return [];
        const map = new Map(books.map((b) => [b.id, b]));
        return lastReadIds.map((id) => map.get(id)).filter(Boolean).slice(0, 6);
    }, [books, lastReadIds]);

    return (
        <div className="min-h-screen bg-stone-950 flex flex-col">
            <Header />

            {/* Hero */}
            <section className="relative grain-overlay overflow-hidden">
                <div
                    className="absolute inset-0 opacity-25"
                    style={{
                        backgroundImage:
                            'url("https://images.unsplash.com/photo-1419640303358-44f0d27f48e7?crop=entropy&cs=srgb&fm=jpg&q=85&w=2000")',
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-stone-950/40 via-stone-950/85 to-stone-950" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 md:pt-28 md:pb-24">
                    <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#d4af37] mb-5">
                        <Sparkles size={12} />
                        A curated competitive-exam library
                    </div>
                    <h1 className="font-serif text-5xl md:text-7xl leading-[0.95] tracking-tight text-stone-50 max-w-3xl">
                        Every book you need,
                        <br />
                        <span className="italic text-[#d4af37]">one tap away</span>.
                    </h1>
                    <p className="mt-6 text-stone-400 text-base md:text-lg max-w-2xl leading-relaxed">
                        Browse the ReadifyBySam index. Filter by subject &amp; exam, save favorites,
                        track your progress — then jump straight into the exact PDF on our Telegram
                        group.
                    </p>

                    <div className="mt-9 flex flex-col sm:flex-row gap-3 max-w-xl">
                        <div className="relative flex-1">
                            <Search
                                size={16}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500"
                            />
                            <Input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search by title, author, topic…"
                                data-testid="search-input"
                                className="pl-10 h-12 bg-stone-900/80 border-stone-800 text-stone-100 placeholder:text-stone-500 focus-visible:ring-[#d4af37]/40"
                            />
                        </div>
                        <a
                            href={TELEGRAM_GROUP}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-testid="hero-telegram-btn"
                            className="h-12 inline-flex items-center justify-center gap-2 px-6 rounded-md bg-[#229ED9] hover:bg-[#1c8bc0] text-white font-semibold text-sm transition-colors"
                        >
                            <Send size={15} />
                            Join Telegram
                        </a>
                    </div>
                </div>
            </section>

            {/* Continue Reading */}
            {continueBooks.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex items-end justify-between mb-6">
                        <div>
                            <div className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37]">
                                <Clock size={11} className="inline -mt-0.5 mr-1" />
                                Pick up where you left off
                            </div>
                            <h2 className="font-serif text-3xl md:text-4xl text-stone-100 mt-2">
                                Continue Reading
                            </h2>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
                        {continueBooks.map((b) => (
                            <BookCard
                                key={b.id}
                                book={b}
                                onOpen={setOpenBook}
                                onFavoriteChange={refresh}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Library */}
            <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 pb-16">
                <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
                    <div>
                        <div className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37]">
                            <Library size={11} className="inline -mt-0.5 mr-1" />
                            The shelves
                        </div>
                        <h2 className="font-serif text-3xl md:text-4xl text-stone-100 mt-2">
                            Browse the Library
                        </h2>
                    </div>
                    <div className="relative flex-1">
                            <Search
                                size={16}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500"
                            />
                            <Input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search by title, author, topic…"
                                data-testid="search-input"
                                className="pl-10 h-12 bg-stone-900/80 border-stone-800 text-stone-100 placeholder:text-stone-500 focus-visible:ring-[#d4af37]/40"
                            />
                        </div>
                    <div className="flex gap-2">
                        <FilterPill
                            testId="view-all"
                            active={view === "all"}
                            onClick={() => setView("all")}
                        >
                            All Books
                        </FilterPill>
                        <FilterPill
                            testId="view-favorites"
                            active={view === "favorites"}
                            onClick={() => setView("favorites")}
                        >
                            <Bookmark size={12} className="inline -mt-0.5 mr-1" />
                            Favorites ({favorites.length})
                        </FilterPill>
                        <FilterPill
                            testId="view-continue"
                            active={view === "continue"}
                            onClick={() => setView("continue")}
                        >
                            Continue
                        </FilterPill>
                    </div>
                </div>

                {/* Filter rows */}
                <div className="space-y-3 mb-8">
                    <div>
                        <div className="text-[10px] uppercase tracking-[0.25em] text-stone-500 mb-2">
                            Subject
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                            <FilterPill
                                testId="subject-All"
                                active={subject === "All"}
                                onClick={() => setSubject("All")}
                            >
                                All
                            </FilterPill>
                            {SUBJECTS.map((s) => (
                                <FilterPill
                                    key={s}
                                    testId={`subject-${s}`}
                                    active={subject === s}
                                    onClick={() => setSubject(s)}
                                >
                                    {s}
                                </FilterPill>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className="text-[10px] uppercase tracking-[0.25em] text-stone-500 mb-2">
                            Exam
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                            <FilterPill
                                testId="exam-All"
                                active={exam === "All"}
                                onClick={() => setExam("All")}
                            >
                                All
                            </FilterPill>
                            {EXAM_TYPES.map((e) => (
                                <FilterPill
                                    key={e}
                                    testId={`exam-${e}`}
                                    active={exam === e}
                                    onClick={() => setExam(e)}
                                >
                                    {e}
                                </FilterPill>
                            ))}
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-stone-500 text-sm py-10" data-testid="loading">
                        Loading library…
                    </div>
                ) : filtered.length === 0 ? (
                    <div
                        className="border border-dashed border-stone-800 rounded-xl py-20 text-center"
                        data-testid="empty-state"
                    >
                        <div className="font-serif text-2xl text-stone-300">
                            {books.length === 0
                                ? "The shelves are empty"
                                : "No books match these filters"}
                        </div>
                        <p className="text-stone-500 mt-2 text-sm">
                            {books.length === 0
                                ? "The librarian will be along shortly."
                                : "Try clearing a filter or your search."}
                        </p>
                    </div>
                ) : (
                    <div
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-7"
                        data-testid="book-grid"
                    >
                        {filtered.map((b) => (
                            <BookCard
                                key={b.id}
                                book={b}
                                onOpen={setOpenBook}
                                onFavoriteChange={refresh}
                            />
                        ))}
                    </div>
                )}
            </section>

            <Footer />

            <BookModal
                book={openBook}
                open={!!openBook}
                onClose={() => setOpenBook(null)}
                onChange={refresh}
            />
        </div>
    );
};

export default HomePage;
