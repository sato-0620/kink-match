// lib/share.ts
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";
import type { StoredLatest, StoredProfile } from "@/lib/storage";

export type SharePayload = {
  v: 1;
  profile: StoredProfile | null;
  latest: StoredLatest;
};

export function encodeShare(payload: SharePayload): string {
  const json = JSON.stringify(payload);
  return compressToEncodedURIComponent(json);
}

export function decodeShare(d: string): SharePayload | null {
  try {
    const json = decompressFromEncodedURIComponent(d);
    if (!json) return null;
    const parsed = JSON.parse(json) as SharePayload;
    if (!parsed?.latest?.scores) return null;
    return parsed;
  } catch {
    return null;
  }
}