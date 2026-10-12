// Keeps the logged-in user (token, role, name) in the browser
export const saveSession = (s) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("session", JSON.stringify(s));
};

export const getSession = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("session");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const clearSession = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("session");
};
