import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Plus, Pencil, Trash2, LogOut, BookMarked, Loader2, ExternalLink } from "lucide-react";
import Header from "../components/Header";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "../components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select";
import { useAdminAuth } from "../context/AdminAuth";
import { fetchBooks, createBook, updateBook, deleteBook } from "../lib/api";
import { SUBJECTS, EXAM_TYPES } from "../lib/constants";
import { toast } from "sonner";

const emptyForm = {
    title: "",
    author: "",
    subject: SUBJECTS[0],
    exam_type: EXAM_TYPES[0],
    telegram_link: "",
    description: "",
};

const AdminDashboard = () => {
    const { isAdmin, ready, logout } = useAdminAuth();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const load = () => {
        setLoading(true);
        fetchBooks()
            .then(setBooks)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (ready && isAdmin) load();
    }, [ready, isAdmin]);

    if (ready && !isAdmin) return <Navigate to="/admin" replace />;

    const openNew = () => {
        setEditing(null);
        setForm(emptyForm);
        setDialogOpen(true);
    };

    const openEdit = (book) => {
        setEditing(book);
        setForm({
            title: book.title,
            author: book.author,
            subject: book.subject,
            exam_type: book.exam_type,
            telegram_link: book.telegram_link,
            description: book.description || "",
        });
        setDialogOpen(true);
    };

    const onSave = async (e) => {
        e.preventDefault();
        if (!form.title.trim() || !form.author.trim() || !form.telegram_link.trim()) {
            toast.error("Title, author and Telegram link are required");
            return;
        }
        setSaving(true);
        try {
            if (editing) {
                await updateBook(editing.id, form);
                toast.success("Book updated");
            } else {
                await createBook(form);
                toast.success("Book added to the library");
            }
            setDialogOpen(false);
            load();
        } catch (err) {
            toast.error(err.response?.data?.detail || "Failed to save");
        } finally {
            setSaving(false);
        }
    };

    const onDelete = async () => {
        try {
            await deleteBook(deleteTarget.id);
            toast.success("Book removed");
            setDeleteTarget(null);
            load();
        } catch (err) {
            toast.error("Failed to delete");
        }
    };

    return (
        <div className="min-h-screen bg-stone-950">
            <Header />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
                    <div>
                        <div className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37]">
                            <BookMarked size={11} className="inline -mt-0.5 mr-1" />
                            Librarian&apos;s Desk
                        </div>
                        <h1 className="font-serif text-4xl md:text-5xl text-stone-100 mt-2">
                            Manage the Library
                        </h1>
                        <p className="text-stone-500 mt-1.5 text-sm">
                            {books.length} {books.length === 1 ? "book" : "books"} on the shelves
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={openNew}
                            data-testid="add-book-btn"
                            className="bg-[#d4af37] hover:bg-[#facc15] text-stone-950 font-semibold gap-2"
                        >
                            <Plus size={16} /> Add Book
                        </Button>
                        <Button
                            onClick={() => {
                                logout();
                                toast.success("Logged out");
                            }}
                            variant="outline"
                            data-testid="logout-btn"
                            className="bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800 gap-2"
                        >
                            <LogOut size={14} /> Logout
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <div className="text-stone-500 py-10">Loading…</div>
                ) : books.length === 0 ? (
                    <div className="border border-dashed border-stone-800 rounded-xl py-24 text-center">
                        <div className="font-serif text-2xl text-stone-300">No books yet</div>
                        <p className="text-stone-500 mt-2 text-sm">
                            Tap &quot;Add Book&quot; to put the first one on the shelves.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-xl border border-stone-800">
                        <table className="w-full" data-testid="books-table">
                            <thead className="bg-stone-900/60">
                                <tr className="text-left text-[10px] uppercase tracking-widest text-stone-500">
                                    <th className="px-5 py-3.5">Title</th>
                                    <th className="px-5 py-3.5">Author</th>
                                    <th className="px-5 py-3.5">Subject</th>
                                    <th className="px-5 py-3.5">Exam</th>
                                    <th className="px-5 py-3.5">Link</th>
                                    <th className="px-5 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {books.map((b) => (
                                    <tr
                                        key={b.id}
                                        className="border-t border-stone-800 hover:bg-stone-900/40 transition-colors"
                                        data-testid={`book-row-${b.id}`}
                                    >
                                        <td className="px-5 py-4 font-serif text-stone-100">
                                            {b.title}
                                        </td>
                                        <td className="px-5 py-4 text-stone-400 text-sm">
                                            {b.author}
                                        </td>
                                        <td className="px-5 py-4 text-stone-400 text-sm">
                                            <span className="px-2 py-1 rounded-full bg-stone-800/70 text-xs">
                                                {b.subject}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-stone-400 text-sm">
                                            <span className="px-2 py-1 rounded-full bg-[#d4af37]/10 text-[#d4af37] text-xs">
                                                {b.exam_type}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-stone-400 text-xs">
                                            <a
                                                href={b.telegram_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 hover:text-[#d4af37]"
                                            >
                                                Open <ExternalLink size={10} />
                                            </a>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <div className="inline-flex gap-1">
                                                <button
                                                    onClick={() => openEdit(b)}
                                                    data-testid={`edit-book-${b.id}`}
                                                    className="w-8 h-8 rounded-md hover:bg-stone-800 text-stone-300 inline-flex items-center justify-center"
                                                >
                                                    <Pencil size={14} />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteTarget(b)}
                                                    data-testid={`delete-book-${b.id}`}
                                                    className="w-8 h-8 rounded-md hover:bg-red-900/40 text-stone-300 hover:text-red-300 inline-flex items-center justify-center"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add/Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent
                    className="bg-stone-950 border-stone-800 text-stone-100 max-w-lg"
                    data-testid="book-form-dialog"
                >
                    <DialogHeader>
                        <DialogTitle className="font-serif text-2xl">
                            {editing ? "Edit Book" : "Add New Book"}
                        </DialogTitle>
                        <DialogDescription className="text-stone-500">
                            Fill in the details. The Telegram link should point straight to the PDF
                            in the group.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={onSave} className="space-y-4 mt-2">
                        <div>
                            <label className="text-xs uppercase tracking-widest text-stone-500">
                                Title *
                            </label>
                            <Input
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                data-testid="form-title"
                                required
                                className="mt-1.5 bg-stone-900 border-stone-800 text-stone-100"
                            />
                        </div>
                        <div>
                            <label className="text-xs uppercase tracking-widest text-stone-500">
                                Author *
                            </label>
                            <Input
                                value={form.author}
                                onChange={(e) => setForm({ ...form, author: e.target.value })}
                                data-testid="form-author"
                                required
                                className="mt-1.5 bg-stone-900 border-stone-800 text-stone-100"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs uppercase tracking-widest text-stone-500">
                                    Subject
                                </label>
                                <Select
                                    value={form.subject}
                                    onValueChange={(v) => setForm({ ...form, subject: v })}
                                >
                                    <SelectTrigger
                                        data-testid="form-subject"
                                        className="mt-1.5 bg-stone-900 border-stone-800 text-stone-100"
                                    >
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-stone-900 border-stone-800 text-stone-100">
                                        {SUBJECTS.map((s) => (
                                            <SelectItem key={s} value={s}>
                                                {s}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-xs uppercase tracking-widest text-stone-500">
                                    Exam Type
                                </label>
                                <Select
                                    value={form.exam_type}
                                    onValueChange={(v) => setForm({ ...form, exam_type: v })}
                                >
                                    <SelectTrigger
                                        data-testid="form-exam"
                                        className="mt-1.5 bg-stone-900 border-stone-800 text-stone-100"
                                    >
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-stone-900 border-stone-800 text-stone-100">
                                        {EXAM_TYPES.map((s) => (
                                            <SelectItem key={s} value={s}>
                                                {s}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs uppercase tracking-widest text-stone-500">
                                Telegram PDF Link *
                            </label>
                            <Input
                                value={form.telegram_link}
                                onChange={(e) =>
                                    setForm({ ...form, telegram_link: e.target.value })
                                }
                                placeholder="https://t.me/Allcompetetiveexamsbooks/123"
                                data-testid="form-link"
                                required
                                className="mt-1.5 bg-stone-900 border-stone-800 text-stone-100"
                            />
                        </div>
                        <div>
                            <label className="text-xs uppercase tracking-widest text-stone-500">
                                Description
                            </label>
                            <Textarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                rows={3}
                                data-testid="form-description"
                                className="mt-1.5 bg-stone-900 border-stone-800 text-stone-100"
                            />
                        </div>
                        <DialogFooter className="gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setDialogOpen(false)}
                                className="bg-stone-900 border-stone-800 text-stone-200 hover:bg-stone-800"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={saving}
                                data-testid="form-submit"
                                className="bg-[#d4af37] hover:bg-[#facc15] text-stone-950 font-semibold gap-2"
                            >
                                {saving && <Loader2 size={14} className="animate-spin" />}
                                {editing ? "Save Changes" : "Add Book"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete confirm */}
            <Dialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
                <DialogContent
                    className="bg-stone-950 border-stone-800 text-stone-100 max-w-md"
                    data-testid="delete-dialog"
                >
                    <DialogHeader>
                        <DialogTitle className="font-serif text-2xl">Remove this book?</DialogTitle>
                        <DialogDescription className="text-stone-500">
                            &quot;{deleteTarget?.title}&quot; will be removed from the shelves. This cannot be
                            undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteTarget(null)}
                            className="bg-stone-900 border-stone-800 text-stone-200 hover:bg-stone-800"
                        >
                            Keep it
                        </Button>
                        <Button
                            onClick={onDelete}
                            data-testid="confirm-delete-btn"
                            className="bg-red-700 hover:bg-red-600 text-white"
                        >
                            Yes, remove
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminDashboard;
