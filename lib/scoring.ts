import { QUESTIONS } from "./questions";
import type { KinkScores } from "../types/kink";

const KEYS: (keyof KinkScores)[] = [
  "dominant","submissive","sadist","masochist","rigger","ropeBunny",
  "degrader","degradee","owner","pet","ageplayer","consent",
];

function clamp(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, n));
}

export function computeScores(answers: number[]): KinkScores & { switchScore: number } {
  if (answers.length !== QUESTIONS.length) {
    throw new Error(`answers length must be ${QUESTIONS.length}`);
  }

  const sum: Record<string, number> = {};
  const max: Record<string, number> = {};
  for (const k of KEYS) { sum[k] = 0; max[k] = 0; }

  QUESTIONS.forEach((q, idx) => {
    const a = answers[idx];
    for (const [k, w] of Object.entries(q.weights)) {
      const weight = w ?? 0;
      sum[k] += a * weight;
      max[k] += 4 * weight;
    }
  });

  const scores: any = {};
  for (const k of KEYS) {
    const denom = max[k] || 1;
    scores[k] = clamp((sum[k] / denom) * 100);
  }

  const switchScore = clamp(Math.min(scores.dominant, scores.submissive));
  return { ...(scores as KinkScores), switchScore };
}