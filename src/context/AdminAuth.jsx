import React, { createContext, useContext, useEffect, useState } from "react";
import { getAdminToken, setAdminToken, clearAdminToken, verifyAdmin, adminLogin } from "../lib/api";

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const t = getAdminToken();
        if (!t) {
            setReady(true);
            return;
        }
        verifyAdmin()
            .then(() => setIsAdmin(true))
            .catch(() => clearAdminToken())
            .finally(() => setReady(true));
    }, []);

    const login = async (email, password) => {
        const { token } = await adminLogin(email, password);
        setAdminToken(token);
        setIsAdmin(true);
    };

    const logout = () => {
        clearAdminToken();
        setIsAdmin(false);
    };

    return (
        <AdminAuthContext.Provider value={{ isAdmin, ready, login, logout }}>
            {children}
        </AdminAuthContext.Provider>
    );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
