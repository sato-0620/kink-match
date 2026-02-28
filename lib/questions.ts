// lib/questions.ts
import type { KinkKey } from "@/types/kink";

export type Question = {
  id: number;
  text: string;
  // その質問がどの特性に効くか（+や-もOK）
  weights: Partial<Record<KinkKey, number>>;
};

export const QUESTIONS: Question[] = [
  { id: 1, text: "主導権を握りたい", weights: { dominant: 1 } },
  { id: 2, text: "相手に任せたい", weights: { submissive: 1 } },
  // ...（あなたの30問をここに）
];