// lib/scoring.ts
import { QUESTIONS } from "@/lib/questions";
import { KINK_KEYS, type KinkKey, type KinkScores } from "@/types/kink";

export function computeScores(answers: number[]): KinkScores {
  const sum = Object.fromEntries(
    KINK_KEYS.map((k) => [k, 0])
  ) as Record<KinkKey, number>;

  const count = Object.fromEntries(
    KINK_KEYS.map((k) => [k, 0])
  ) as Record<KinkKey, number>;

  for (let i = 0; i < QUESTIONS.length; i++) {
    const q = QUESTIONS[i];
    const key = q.key;

    if (!key) continue;

    const raw = answers[i];

    // ✅ ここ超重要：必ず数値にする
    const value = Number(raw);

    if (!Number.isFinite(value)) continue;

    const clamped = Math.max(0, Math.min(4, value));

    sum[key] += clamped;
    count[key] += 1;
  }

  const result = {} as KinkScores;

  for (const k of KINK_KEYS) {
    const avg = count[k] > 0 ? sum[k] / count[k] : 0;
    result[k] = Math.round((avg / 4) * 100);
  }

  return result;
}