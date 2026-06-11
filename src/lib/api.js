import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
export const API = `${API_BASE_URL}/api`;

const ADMIN_TOKEN_KEY = "readify_admin_token";

export const getAdminToken = () => localStorage.getItem(ADMIN_TOKEN_KEY);
export const setAdminToken = (token) => localStorage.setItem(ADMIN_TOKEN_KEY, token);
export const clearAdminToken = () => localStorage.removeItem(ADMIN_TOKEN_KEY);

export const api = axios.create({ baseURL: API });

api.interceptors.request.use((config) => {
    const token = getAdminToken();
    if (token) {
        config.headers["X-Admin-Token"] = token;
    }
    return config;
});

export const fetchBooks = async () => {
    const { data } = await api.get("/books");
    return data;
};

export const createBook = async (book) => {
    const { data } = await api.post("/books", book);
    return data;
};

export const updateBook = async (id, book) => {
    const { data } = await api.put(`/books/${id}`, book);
    return data;
};

export const deleteBook = async (id) => {
    const { data } = await api.delete(`/books/${id}`);
    return data;
};

export const adminLogin = async (email, password) => {
    const { data } = await api.post("/admin/login", { email, password });
    return data;
};

export const verifyAdmin = async () => {
    const { data } = await api.get("/admin/verify");
    return data;
};
