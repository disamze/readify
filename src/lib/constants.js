export const TELEGRAM_GROUP = "https://t.me/Allcompetetiveexamsbooks";

export const SUBJECTS = [
    "Modules",
    "Math",
    "English",
    "Reasoning",
    "GK",
    "Current Affairs",
    "Science",
    "History",
    "Geography",
    "Computer",
    "Hindi",
    "Other",
];

export const EXAM_TYPES = [
    "SSC",
    "Jee",
    "Neet",
    "Cuet UG",
    "UPSC",
    "Banking",
    "Railway",
    "Defence",
    "Class 11th",
    "Class 12th",
    "Class 10th",
    "Class 9th",
    "Other",
];

// Subject -> tailwind color palette for generative book covers
export const SUBJECT_PALETTE = {
    Math: { bg: "#78350f", glow: "#fbbf24", text: "#fffbeb" },
    English: { bg: "#064e3b", glow: "#34d399", text: "#ecfdf5" },
    Reasoning: { bg: "#312e81", glow: "#818cf8", text: "#eef2ff" },
    GK: { bg: "#7f1d1d", glow: "#f87171", text: "#fef2f2" },
    "Current Affairs": { bg: "#7c2d12", glow: "#fb923c", text: "#fff7ed" },
    Science: { bg: "#134e4a", glow: "#5eead4", text: "#f0fdfa" },
    History: { bg: "#451a03", glow: "#d97706", text: "#fffbeb" },
    Geography: { bg: "#14532d", glow: "#86efac", text: "#f0fdf4" },
    Computer: { bg: "#1e293b", glow: "#7dd3fc", text: "#f0f9ff" },
    Hindi: { bg: "#581c87", glow: "#c084fc", text: "#faf5ff" },
    Other: { bg: "#292524", glow: "#d4af37", text: "#fafaf9" },
};

export const paletteFor = (subject) =>
    SUBJECT_PALETTE[subject] || SUBJECT_PALETTE.Other;
