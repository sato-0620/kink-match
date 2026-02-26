// lib/scoring.ts

import { QUESTIONS } from "./questions";
import { KINK_KEYS, type KinkKey, type KinkScores } from "../types/kink";

/**
 * answers: 0〜4 の配列
 * 戻り値: 0〜100 のパーセンテージ
 */
export function computeScores(answers: number[]): KinkScores {
  // 初期化
  const totals: Record<KinkKey, number> = {} as Record<KinkKey, number>;
  const maxTotals: Record<KinkKey, number> = {} as Record<KinkKey, number>;

  for (const key of KINK_KEYS) {
    totals[key] = 0;
    maxTotals[key] = 0;
  }

  QUESTIONS.forEach((question, index) => {
    const answer = answers[index] ?? 0; // 未回答は0扱い
    const normalized = answer / 4; // 0〜4 → 0〜1

    if (!question.weights) return;

    for (const key of KINK_KEYS) {
      const weight = question.weights[key] ?? 0;
      if (!weight) continue;

      totals[key] += normalized * weight;
      maxTotals[key] += 1 * weight;
    }
  });

  const result: Record<KinkKey, number> = {} as Record<KinkKey, number>;

  for (const key of KINK_KEYS) {
    if (maxTotals[key] === 0) {
      result[key] = 0;
    } else {
      result[key] = Math.round(
        (totals[key] / maxTotals[key]) * 100
      );
    }
  }

  return result;
}