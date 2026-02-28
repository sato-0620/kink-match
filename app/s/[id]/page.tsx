// app/s/[id]/page.tsx
import { kv } from "@vercel/kv";
import { LABELS_JA, KINK_KEYS, type KinkKey } from "@/types/kink";

export const runtime = "nodejs";

type Payload = {
  scores: Record<string, number>;
  answers: number[];
  at: number;
};

export default async function SharePage({ params }: { params: { id: string } }) {
  const key = `share:${params.id}`;
  const data = (await kv.get<Payload>(key)) ?? null;

  if (!data) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <p>共有リンクが無効、または期限切れです。</p>
      </main>
    );
  }

  const rows = KINK_KEYS
    .map((k: KinkKey) => ({
      key: k,
      label: LABELS_JA[k],
      value: Number(data.scores?.[k] ?? 0),
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center mb-2">診断結果（共有）</h1>
        <p className="text-center text-xs text-white/60">
          共有日時: {new Date(data.at).toLocaleString("ja-JP")}
        </p>

        {rows.map(({ key, label, value }) => (
          <div key={key} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{label}</span>
              <span>{value}%</span>
            </div>
            <div className="w-full h-2 bg-gray-800 rounded">
              <div className="h-2 bg-red-600 rounded" style={{ width: `${value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}