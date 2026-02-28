// lib/storage.ts
export type StoredLatest = {
  scores: Record<string, number>;
  answers: number[];
  at: number;
};

export type StoredProfile = {
  name: string;        // 表示名
  handle?: string;     // @id
  bio?: string;        // ひとこと
  updatedAt: number;
};

const KEY_LATEST = "kinkmatch:latest";
const KEY_PROFILE = "kinkmatch:profile";

export function loadLatest(): StoredLatest | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY_LATEST);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredLatest;
  } catch {
    return null;
  }
}

export function saveLatest(v: StoredLatest) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY_LATEST, JSON.stringify(v));
}

export function loadProfile(): StoredProfile | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY_PROFILE);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredProfile;
  } catch {
    return null;
  }
}

export function saveProfile(v: StoredProfile) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY_PROFILE, JSON.stringify(v));
}