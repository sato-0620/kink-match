// types/kink.ts
export const KINK_KEYS = [
  "dominant",
  "submissive",
  "sadist",
  "masochist",
  "rigger",
  "ropeBunny",
  "degrader",
  "degradee",
  "owner",
  "pet",
  "ageplayer",
  "switch",
] as const;

export type KinkKey = (typeof KINK_KEYS)[number];

export type KinkScores = Record<KinkKey, number>;

export const LABELS_JA: Record<KinkKey, string> = {
  dominant: "ドミナント",
  submissive: "サブミッシブ",
  sadist: "サディスト",
  masochist: "マゾヒスト",
  rigger: "リガー",
  ropeBunny: "ロープバニー",
  degrader: "デグレーダー",
  degradee: "デグレード",
  owner: "オーナー",
  pet: "ペット",
  ageplayer: "エイジプレイヤー",
  switch: "スイッチ",
};