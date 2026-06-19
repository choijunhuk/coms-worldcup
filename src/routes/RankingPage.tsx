import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { EmptyState } from "../components/EmptyState";
import { RankingTable } from "../components/RankingTable";
import { findSampleWorldCup } from "../lib/sampleData";
import { getStoredResults, getStoredTemplates } from "../lib/storage";
import { calculateRankings } from "../lib/worldcupEngine";
import type { WorldCupTemplate } from "../types/worldcup";

const findTemplate = (id: string | undefined): WorldCupTemplate | undefined => {
  if (!id) {
    return undefined;
  }
  return getStoredTemplates().find((template) => template.id === id) ?? findSampleWorldCup(id);
};

export function RankingPage() {
  const { id } = useParams();
  const template = useMemo(() => findTemplate(id), [id]);
  const rankings = template ? calculateRankings(getStoredResults(), template) : [];

  if (!template) {
    return <EmptyState title="랭킹을 계산할 월드컵이 없습니다" description="먼저 월드컵을 만들거나 샘플을 플레이해 주세요." actionLabel="홈으로" actionTo="/" />;
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="apple-eyebrow">Local ranking</p>
        <h1 className="mt-3 break-words text-4xl font-black text-[var(--app-text)]">{template.title} 랭킹</h1>
        <p className="mt-3 text-base leading-7 text-[var(--app-muted)]">이 브라우저에서 플레이한 결과만 기반으로 계산합니다. 서버 DB로 옮기기 쉽도록 계산 로직은 `lib`에 분리했습니다.</p>
      </header>
      <RankingTable rankings={rankings} />
    </div>
  );
}
