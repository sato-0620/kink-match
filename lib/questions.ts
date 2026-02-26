export type Question = {
  id: number;
  text: string;
  weights: Partial<Record<
    | "dominant"
    | "submissive"
    | "sadist"
    | "masochist"
    | "rigger"
    | "ropeBunny"
    | "degrader"
    | "degradee"
    | "owner"
    | "pet"
    | "ageplayer"
    | "consent",
    number
  >>;
};

export const QUESTIONS: Question[] = [
  { id: 1, text: "主導権を握る立場に安心感を覚える", weights: { dominant: 1 } },
  { id: 2, text: "相手を導く・管理することに魅力を感じる", weights: { dominant: 1, owner: 0.25 } },
  { id: 3, text: "主導権を相手に委ねることで落ち着く", weights: { submissive: 1 } },
  { id: 4, text: "相手の指示に従うことに心地よさを感じる", weights: { submissive: 1, pet: 0.25 } },
  { id: 5, text: "相手の反応を引き出すことに高揚感を覚える", weights: { sadist: 1 } },
  { id: 6, text: "相手を追い詰める“演出”に魅力を感じる", weights: { sadist: 1, degrader: 0.25 } },
  { id: 7, text: "強く扱われることに安心感を覚える", weights: { masochist: 1 } },
  { id: 8, text: "痛みや緊張感が刺激として魅力的に感じる", weights: { masochist: 1 } },
  { id: 9, text: "相手を拘束・固定する演出に興味がある", weights: { rigger: 1 } },
  { id: 10, text: "身体や動きを制御することに美しさを感じる", weights: { rigger: 1, dominant: 0.25 } },
  { id: 11, text: "身動きを制限されることに安心感がある", weights: { ropeBunny: 1 } },
  { id: 12, text: "身体を預けることに信頼を感じる", weights: { ropeBunny: 1, submissive: 0.25 } },
  { id: 13, text: "相手のプライドを揺さぶる言葉に興奮する", weights: { degrader: 1 } },
  { id: 14, text: "上下関係を明確にする言動に魅力を感じる", weights: { degrader: 1, owner: 0.25 } },
  { id: 15, text: "価値を揺さぶられる言葉に強く反応する", weights: { degradee: 1 } },
  { id: 16, text: "上下関係を明確にされることに安心する", weights: { degradee: 1, pet: 0.25 } },
  { id: 17, text: "相手を自分のものとして扱う関係に憧れる", weights: { owner: 1 } },
  { id: 18, text: "排他的な支配関係に魅力を感じる", weights: { owner: 1, dominant: 0.25 } },
  { id: 19, text: "誰かに“所有される”感覚に安心を覚える", weights: { pet: 1 } },
  { id: 20, text: "役割を与えられる関係性に惹かれる", weights: { pet: 1, submissive: 0.25 } },
  { id: 21, text: "年齢差や役割差の“演出”に強く惹かれる", weights: { ageplayer: 1 } },
  { id: 22, text: "守る／守られる構図に特別な魅力を感じる", weights: { ageplayer: 1 } },
  { id: 23, text: "相手が嫌だと感じたら即座にやめるべきだと思う", weights: { consent: 1 } },
  { id: 24, text: "事前に境界やNGを共有することは重要だ", weights: { consent: 1 } },
  { id: 25, text: "合意はいつでも撤回できるものだと思う", weights: { consent: 1 } },
  { id: 26, text: "興奮状態でも相手の様子を観察する必要がある", weights: { consent: 1 } },
  { id: 27, text: "相手が黙っている場合は確認すべきだ", weights: { consent: 1 } },
  { id: 28, text: "事後のケアは関係性にとって重要だ", weights: { consent: 1 } },
  { id: 29, text: "相手によって“導く側／委ねる側”を切り替えたい", weights: { dominant: 0.75, submissive: 0.75 } },
  { id: 30, text: "相手に合わせて関係性の“役割”を作るのが好きだ", weights: { owner: 0.25, pet: 0.25, dominant: 0.25, submissive: 0.25 } },
];