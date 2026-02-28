// lib/scoring.ts
import { QUESTIONS } from "@/lib/questions";
import { KINK_KEYS, type KinkKey, type KinkScores } from "@/types/kink";

/**
 * answers: 0〜4 の配列（QUESTIONSと同じ長さ）
 * 0=全く当てはまらない ... 4=強く当てはまる
 */
export function computeScores(answers: number[]): KinkScores {
  // 初期化
  const raw: Record<KinkKey, number> = Object.fromEntries(
    KINK_KEYS.map((k) => [k, 0])
  ) as Record<KinkKey, number>;

  const maxPossible: Record<KinkKey, number> = Object.fromEntries(
    KINK_KEYS.map((k) => [k, 0])
  ) as Record<KinkKey, number>;

  QUESTIONS.forEach((q, idx) => {
    const a = clampAnswer(answers[idx] ?? 0); // 0..4
    const w = (q as any).weights as Partial<Record<KinkKey, number>> | undefined;
    if (!w) return;

    (Object.keys(w) as KinkKey[]).forEach((k) => {
      const weight = Number(w[k] ?? 0);
      if (!Number.isFinite(weight) || weight === 0) return;

      raw[k] += a * weight;
      maxPossible[k] += 4 * weight;
    });
  });

  // 0〜100%へ正規化
  const scores = Object.fromEntries(
    KINK_KEYS.map((k) => {
      const max = maxPossible[k];
      const pct = max > 0 ? Math.round((raw[k] / max) * 100) : 0;
      return [k, clampPct(pct)];
    })
  ) as KinkScores;

  return scores;
}

function clampAnswer(n: number) {
  const x = Number(n);
  if (!Number.isFinite(x)) return 0;
  return Math.max(0, Math.min(4, Math.round(x)));
}

function clampPct(n: number) {
  const x = Number(n);
  if (!Number.isFinite(x)) return 0;
  return Math.max(0, Math.min(100, Math.round(x)));
}