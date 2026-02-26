import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-xl">
        <p className="text-xs tracking-[0.3em] text-zinc-400">KINK MATCH / UNDERGROUND</p>

        <h1 className="mt-3 text-4xl font-bold">
          理解されない嗜好を、
          <br />
          理解できる相手とだけ繋ぐ。
        </h1>

        <p className="mt-4 text-zinc-400 leading-relaxed">
          30問の診断で傾向を可視化。
          <br />
          合意理解度が一定以上の相手だけが“見える”設計。
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/diagnosis"
            className="rounded-lg bg-red-600 px-6 py-3 font-semibold hover:bg-red-700 text-center"
          >
            診断を始める
          </Link>

          <Link
            href="/result"
            className="rounded-lg border border-zinc-800 px-6 py-3 text-zinc-200 hover:bg-zinc-900 text-center"
          >
            結果を見る（保存済みなら）
          </Link>
        </div>

        <div className="mt-10 text-xs text-zinc-500">
          ※18歳未満利用不可 / 露骨な投稿・連絡先交換は禁止 / DM機能なし
        </div>
      </div>
    </main>
  );
}