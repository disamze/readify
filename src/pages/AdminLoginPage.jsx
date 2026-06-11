import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { ShieldCheck, BookMarked, Loader2 } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useAdminAuth } from "../context/AdminAuth";
import { toast } from "sonner";

const AdminLoginPage = () => {
    const { isAdmin, login, ready } = useAdminAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    if (ready && isAdmin) return <Navigate to="/admin/dashboard" replace />;

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            toast.success("Welcome back, Sam.");
            navigate("/admin/dashboard");
        } catch (err) {
            toast.error("Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-stone-950 relative grain-overlay flex items-center justify-center px-4">
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage:
                        'url("https://images.unsplash.com/photo-1472173148041-00294f0814a2?crop=entropy&cs=srgb&fm=jpg&q=85&w=2000")',
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-stone-950/70 via-stone-950/90 to-stone-950" />

            <form
                onSubmit={onSubmit}
                data-testid="admin-login-form"
                className="relative w-full max-w-md bg-stone-900/80 backdrop-blur-md border border-stone-800 rounded-xl p-8 shadow-2xl"
            >
                <div className="flex items-center gap-2.5 mb-7">
                    <div className="w-10 h-10 rounded-md bg-[#d4af37] flex items-center justify-center">
                        <BookMarked size={20} className="text-stone-950" />
                    </div>
                    <div>
                        <div className="font-serif text-2xl text-stone-100">
                            Readify<span className="text-[#d4af37]">BySam</span>
                        </div>
                        <div className="text-[10px] uppercase tracking-[0.25em] text-stone-500">
                            Librarian&apos;s Desk
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 mb-5 text-[#d4af37]">
                    <ShieldCheck size={14} />
                    <span className="text-xs uppercase tracking-widest">Admin Access</span>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs uppercase tracking-widest text-stone-500">
                            Email
                        </label>
                        <Input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            data-testid="admin-email-input"
                            className="mt-1.5 bg-stone-950 border-stone-800 text-stone-100 h-11 focus-visible:ring-[#d4af37]/40"
                        />
                    </div>
                    <div>
                        <label className="text-xs uppercase tracking-widest text-stone-500">
                            Password
                        </label>
                        <Input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            data-testid="admin-password-input"
                            className="mt-1.5 bg-stone-950 border-stone-800 text-stone-100 h-11 focus-visible:ring-[#d4af37]/40"
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    data-testid="admin-login-submit"
                    className="mt-7 w-full h-11 bg-[#d4af37] hover:bg-[#facc15] text-stone-950 font-semibold gap-2"
                >
                    {loading && <Loader2 size={14} className="animate-spin" />}
                    Enter the Library
                </Button>
            </form>
        </div>
    );
};

export default AdminLoginPage;
