// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-14">
      <div className="mx-auto w-full max-w-2xl space-y-8">
        <div className="space-y-2">
          <div className="text-xs tracking-widest text-zinc-400">
            KINK MATCH / UNDERGROUND
          </div>
          <h1 className="text-3xl font-bold">
            理解されない嗜好を、
            <br />
            理解できる相手とだけ繋ぐ。
          </h1>
          <p className="text-sm text-zinc-400">
            30問の診断で傾向を可視化。本名や連絡先の交換はなし（DM機能なし）。
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/diagnosis"
            className="block rounded-lg bg-red-600 px-6 py-3 text-center font-semibold hover:bg-red-700"
          >
            診断を始める
          </Link>

          <Link
            href="/result"
            className="block rounded-lg border border-zinc-800 px-6 py-3 text-center text-zinc-200 hover:bg-zinc-950"
          >
            結果を見る（保存済みなら）
          </Link>

          <p className="pt-2 text-xs text-zinc-500">
            ※18歳未満利用不可 / 露骨な投稿・連絡先交換は禁止 / DM機能なし
          </p>
        </div>
      </div>
    </main>
  );
}