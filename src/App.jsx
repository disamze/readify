import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AdminAuthProvider } from "./context/AdminAuth.jsx";
import HomePage from "./pages/HomePage.jsx";
import AdminLoginPage from "./pages/AdminLoginPage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <AdminAuthProvider>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/admin" element={<AdminLoginPage />} />
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    </Routes>
                    <Toaster
                        position="top-right"
                        theme="dark"
                        toastOptions={{
                            style: {
                                background: "#1c1917",
                                border: "1px solid #292524",
                                color: "#f5f5f4",
                            },
                        }}
                    />
                </AdminAuthProvider>
            </BrowserRouter>
        </div>
    );
}

export default App;
