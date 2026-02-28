// lib/match.ts
import type { KinkKey, KinkScores } from "@/types/kink";

export type MatchBreakdownItem = {
  id: string;
  title: string;
  score: number;
  detail: string;
};

export type MatchResult = {
  total: number;
  breakdown: MatchBreakdownItem[];
};

const clamp = (n: number) => Math.max(0, Math.min(100, n));

function complementPair(
  a: KinkScores,
  b: KinkScores,
  left: KinkKey,
  right: KinkKey,
  title: string
): MatchBreakdownItem {
  const p1 = Math.min(a[left], b[right]);
  const p2 = Math.min(a[right], b[left]);
  const base = Math.max(p1, p2);
  return {
    id: `${left}_${right}`,
    title,
    score: clamp(base),
    detail: "補完関係スコア",
  };
}

function switchFlex(a: KinkScores, b: KinkScores): MatchBreakdownItem {
  const score = clamp((a.switch + b.switch) / 2);
  return {
    id: "switch",
    title: "柔軟性（スイッチ）",
    score,
    detail: "役割の切替が得意だと相性UP",
  };
}

export function calcMatch(a: KinkScores, b: KinkScores): MatchResult {
  const breakdown: MatchBreakdownItem[] = [
    complementPair(a, b, "dominant", "submissive", "主導権"),
    complementPair(a, b, "sadist", "masochist", "刺激"),
    complementPair(a, b, "rigger", "ropeBunny", "拘束"),
    complementPair(a, b, "degrader", "degradee", "言葉"),
    complementPair(a, b, "owner", "pet", "関係性"),
    switchFlex(a, b),
  ];

  const total =
    breakdown.reduce((sum, x) => sum + x.score, 0) / breakdown.length;

  return { total: clamp(total), breakdown };
}