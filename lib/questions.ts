// lib/questions.ts
import type { KinkKey } from "@/types/kink";

export type Question = {
  id: number;
  text: string;
  key: KinkKey;
};

/**
 * 30問（consent なし）
 * key は types/kink.ts の KINK_KEYS に含まれるものだけ使うこと
 */
export const QUESTIONS: Question[] = [
  // dominant / submissive
  { id: 1, text: "主導権を握って進める方が落ち着く。", key: "dominant" },
  { id: 2, text: "相手にリードされる方が安心できる。", key: "submissive" },
  { id: 3, text: "状況をコントロールできると高まる。", key: "dominant" },
  { id: 4, text: "指示やルールがある方が気持ちが乗る。", key: "submissive" },

  // sadist / masochist
  { id: 5, text: "相手の反応（声・表情）を引き出すのが好き。", key: "sadist" },
  { id: 6, text: "軽い痛みや刺激がある方が高まりやすい。", key: "masochist" },
  { id: 7, text: "相手を焦らしたり弄ぶ展開に惹かれる。", key: "sadist" },
  { id: 8, text: "少し意地悪されるくらいがちょうどいい。", key: "masochist" },

  // rigger / ropeBunny
  { id: 9, text: "縛り（ロープ/拘束）の構造や手順に興味がある。", key: "rigger" },
  { id: 10, text: "拘束されると気持ちが切り替わりやすい。", key: "ropeBunny" },
  { id: 11, text: "道具や結び方を工夫するのが楽しい。", key: "rigger" },
  { id: 12, text: "身動きが制限されると高まりやすい。", key: "ropeBunny" },

  // degrader / degradee
  { id: 13, text: "言葉で相手を煽ったり挑発するのが好き。", key: "degrader" },
  { id: 14, text: "少し強い言葉を向けられるとゾクっとする。", key: "degradee" },
  { id: 15, text: "相手のプライドを揺さぶる展開に惹かれる。", key: "degrader" },
  { id: 16, text: "恥ずかしさが混ざると気持ちが上がる。", key: "degradee" },

  // owner / pet
  { id: 17, text: "相手を『自分のもの』として扱う演出が好き。", key: "owner" },
  { id: 18, text: "可愛がられる／飼われる設定がしっくりくる。", key: "pet" },
  { id: 19, text: "役割（主/従・飼い主/ペット）を決めるのが好き。", key: "owner" },
  { id: 20, text: "褒められたり躾けられると気持ちが乗る。", key: "pet" },

  // ageplayer
  { id: 21, text: "年上/年下っぽいロールで気分が変わる。", key: "ageplayer" },
  { id: 22, text: "甘えた口調や子供っぽい演出に惹かれる。", key: "ageplayer" },

  // switch
  { id: 23, text: "相手次第で主導にも受け身にもなれる。", key: "switch" },
  { id: 24, text: "気分やシチュで役割が変わることが多い。", key: "switch" },

  // 追加（バランス取り：dominant/submissive/sadist/masochist/rigger/ropeBunny）
  { id: 25, text: "ペース配分や流れを設計するのが得意。", key: "dominant" },
  { id: 26, text: "任せられると楽になって集中できる。", key: "submissive" },
  { id: 27, text: "相手の限界手前の反応を見るのが好き。", key: "sadist" },
  { id: 28, text: "少し我慢する/耐える要素があると燃える。", key: "masochist" },
  { id: 29, text: "拘束や道具を使うとテンションが上がる。", key: "rigger" },
  { id: 30, text: "拘束される/動けない状況が好き。", key: "ropeBunny" },
];