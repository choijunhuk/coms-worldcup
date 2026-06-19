import { useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { EmptyState } from "../components/EmptyState";
import { ResultCard } from "../components/ResultCard";
import { copyText, createWorldCupShareText } from "../lib/share";
import { getResultById } from "../lib/storage";

export function ResultPage() {
  const { id } = useParams();
  const location = useLocation();
  const routeState = location.state as { result?: ReturnType<typeof getResultById>; storageWarning?: boolean } | null;
  const result = id ? getResultById(id) ?? routeState?.result : routeState?.result;
  const [copied, setCopied] = useState(false);
  const shareText = useMemo(() => (result ? createWorldCupShareText(result) : ""), [result]);

  if (!result) {
    return <EmptyState title="결과를 찾을 수 없습니다" description="이 브라우저에 저장된 결과가 아니거나 삭제되었습니다." actionLabel="홈으로" actionTo="/" />;
  }

  const copy = async (): Promise<void> => {
    const ok = await copyText(shareText);
    setCopied(ok);
  };

  return (
    <div className="space-y-6">
      <ResultCard result={result} shareText={shareText} onCopy={copy} />
      {routeState?.storageWarning ? (
        <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700">
          브라우저 저장소에 결과를 저장하지 못했습니다. 이 결과는 새로고침하면 사라질 수 있습니다.
        </p>
      ) : null}
      {copied ? <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">공유 텍스트를 복사했습니다.</p> : null}
      <section className="coms-card p-5">
        <h2 className="text-xl font-black text-[var(--app-text)]">내 선택 기록</h2>
        <div className="mt-4 grid gap-3">
          {result.choices.map((choice) => (
            <div key={choice.matchId} className="rounded-lg bg-[var(--app-surface-soft)] px-4 py-3 text-sm leading-6">
              <span className="font-black text-[var(--app-text)]">{choice.selectedName}</span>
              <span className="text-[var(--app-muted)]"> 이겼고 </span>
              <span className="font-semibold text-[var(--app-muted)]">{choice.rejectedName}</span>
              <span className="text-[var(--app-muted)]"> 탈락</span>
            </div>
          ))}
        </div>
        <Link className="coms-button-primary mt-5 inline-flex" to={`/play/${result.templateId}`}>
          다시 하기
        </Link>
      </section>
    </div>
  );
}
