import type { WorldCupRanking } from "../types/worldcup";

interface RankingTableProps {
  rankings: WorldCupRanking[];
}

const percent = (value: number): string => `${Math.round(value * 100)}%`;

export function RankingTable({ rankings }: RankingTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-[var(--app-hairline)] bg-[var(--app-surface)]">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[var(--app-surface-soft)] text-xs font-black text-[var(--app-subtle)]">
            <tr>
              <th className="px-4 py-3">항목</th>
              <th className="px-4 py-3">우승</th>
              <th className="px-4 py-3">결승</th>
              <th className="px-4 py-3">선택</th>
              <th className="px-4 py-3">승률</th>
              <th className="px-4 py-3">우승률</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--app-hairline)]">
            {rankings.map((ranking) => (
              <tr key={ranking.itemId} className="text-[var(--app-text)]">
                <td className="max-w-64 break-words px-4 py-4 font-black">{ranking.itemName}</td>
                <td className="px-4 py-4 font-bold">{ranking.wins}</td>
                <td className="px-4 py-4">{ranking.finals}</td>
                <td className="px-4 py-4">{ranking.selectedCount}</td>
                <td className="px-4 py-4">{percent(ranking.winRate)}</td>
                <td className="px-4 py-4">{percent(ranking.championRate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
