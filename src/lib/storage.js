const isBrowser = typeof window !== "undefined";

export const STORAGE_KEYS = {
  users: "clipnest-users",
  session: "clipnest-session",
  pastesByUser: "clipnest-pastes-by-user",
  legacyPastes: "pastes",
};

export function readJSON(key, fallback) {
  if (!isBrowser) {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key, value) {
  if (!isBrowser) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function removeStorageItem(key) {
  if (!isBrowser) {
    return;
  }

  window.localStorage.removeItem(key);
}

export function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

export function createId(prefix = "id") {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}
