import { QUESTIONS } from "./questions";
import { KINK_KEYS, type KinkKey, type KinkScores } from "../types/kink";

/**
 * answers: 0〜4 の配列（QUESTIONS と同じ順）
 * 戻り値: 各カテゴリの 0〜100(%) スコア
 */
export function computeScores(answers: number[]): KinkScores {
  const sum: Partial<Record<KinkKey, number>> = {};
  const cnt: Partial<Record<KinkKey, number>> = {};

  for (let i = 0; i < QUESTIONS.length; i++) {
    const q = QUESTIONS[i] as { key: KinkKey };
    const v = Number.isFinite(answers[i]) ? (answers[i] as number) : 0;

    sum[q.key] = (sum[q.key] ?? 0) + v;
    cnt[q.key] = (cnt[q.key] ?? 0) + 1;
  }

  const out = {} as KinkScores;

  for (const k of KINK_KEYS) {
    const s = sum[k] ?? 0;
    const c = cnt[k] ?? 0;
    const max = c * 4; // 0〜4 なので最大 4*c
    const pct = max === 0 ? 0 : Math.round((s / max) * 100);
    out[k] = clamp01to100(pct);
  }

  return out;
}

function clamp01to100(n: number) {
  if (!Number.isFinite(n)) return 0;
  if (n < 0) return 0;
  if (n > 100) return 100;
  return Math.round(n);
}