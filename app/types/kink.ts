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

// 結果表示を日本語にしたい時に使う
export const KINK_LABELS: Record<KinkKey, string> = {
  dominant: "優性",
  submissive: "サブミッシブ",
  sadist: "サディスト",
  masochist: "マゾヒスト",
  rigger: "リガー",
  ropeBunny: "ロープバニー",
  degrader: "劣化装置",
  degradee: "デグレード",
  owner: "オーナー",
  pet: "ペット",
  ageplayer: "年齢プレイヤー",
  switch: "スイッチ",
};