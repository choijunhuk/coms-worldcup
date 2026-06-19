import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EmptyState } from "../components/EmptyState";
import { ResultCard } from "../components/ResultCard";
import { WorldCupList } from "../components/WorldCupList";
import { getSharedDocument } from "../lib/miniApi";
import { copyText, createWorldCupShareText } from "../lib/share";
import type { WorldCupResult, WorldCupTemplate } from "../types/worldcup";

const isResult = (payload: WorldCupResult | WorldCupTemplate): payload is WorldCupResult =>
  "winner" in payload && "choices" in payload;

export function SharedWorldCupPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [payload, setPayload] = useState<WorldCupResult | WorldCupTemplate | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) {
      setError("공유 링크가 올바르지 않습니다.");
      return;
    }
    getSharedDocument(slug)
      .then((document) => setPayload(document.payload))
      .catch(() => setError("공유된 월드컵을 찾을 수 없습니다."));
  }, [slug]);

  if (error) {
    return <EmptyState title="공유 월드컵을 열 수 없습니다" description={error} actionLabel="홈으로" actionTo="/" />;
  }

  if (!payload) {
    return <div className="coms-card p-6 text-sm font-bold text-[var(--app-muted)]">공유 월드컵을 불러오는 중입니다.</div>;
  }

  if (isResult(payload)) {
    const shareText = createWorldCupShareText(payload);
    return (
      <div className="space-y-6">
        <ResultCard result={payload} shareText={shareText} onCopy={() => void copyText(`${shareText}\n${window.location.href}`)} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="apple-eyebrow">Shared template</p>
        <h1 className="mt-3 text-4xl font-black text-[var(--app-text)]">공유된 월드컵</h1>
      </header>
      <WorldCupList title="바로 플레이" templates={[payload]} emptyText="공유된 템플릿이 없습니다." />
      <button type="button" className="coms-button-primary" onClick={() => navigate(`/play/${payload.id}`, { state: { template: payload } })}>
        이 월드컵 시작하기
      </button>
    </div>
  );
}
