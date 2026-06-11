// localStorage helpers for favorites, progress and last-read
const FAV_KEY = "readify_favorites";
const PROG_KEY = "readify_progress";
const LAST_KEY = "readify_last_read";

const readJSON = (key, fallback) => {
    try {
        const v = localStorage.getItem(key);
        return v ? JSON.parse(v) : fallback;
    } catch {
        return fallback;
    }
};
const writeJSON = (key, val) => localStorage.setItem(key, JSON.stringify(val));

// FAVORITES (array of book ids)
export const getFavorites = () => readJSON(FAV_KEY, []);
export const isFavorite = (id) => getFavorites().includes(id);
export const toggleFavorite = (id) => {
    const favs = getFavorites();
    const next = favs.includes(id) ? favs.filter((x) => x !== id) : [...favs, id];
    writeJSON(FAV_KEY, next);
    return next;
};

// PROGRESS (map id -> 0..100)
export const getAllProgress = () => readJSON(PROG_KEY, {});
export const getProgress = (id) => getAllProgress()[id] ?? 0;
export const setProgress = (id, value) => {
    const all = getAllProgress();
    all[id] = Math.max(0, Math.min(100, Math.round(value)));
    writeJSON(PROG_KEY, all);
    return all[id];
};

// LAST READ (array of {id, ts}, most recent first, max 12)
export const getLastRead = () => readJSON(LAST_KEY, []);
export const markLastRead = (id) => {
    const list = getLastRead().filter((x) => x.id !== id);
    list.unshift({ id, ts: Date.now() });
    const trimmed = list.slice(0, 12);
    writeJSON(LAST_KEY, trimmed);
    return trimmed;
};
