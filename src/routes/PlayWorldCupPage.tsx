import { RotateCcw, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { EmptyState } from "../components/EmptyState";
import { MatchView } from "../components/MatchView";
import { ProgressBar } from "../components/ProgressBar";
import { findSampleWorldCup } from "../lib/sampleData";
import { getStoredTemplates, saveResult } from "../lib/storage";
import { createPlaySession, getActiveMatch, getCurrentProgress, recordChoice, undoLastChoice } from "../lib/worldcupEngine";
import type { WorldCupPlaySession, WorldCupTemplate } from "../types/worldcup";

const findTemplate = (id: string | undefined): WorldCupTemplate | undefined => {
  if (!id) {
    return undefined;
  }
  return getStoredTemplates().find((template) => template.id === id) ?? findSampleWorldCup(id);
};

export function PlayWorldCupPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const routeState = location.state as { template?: WorldCupTemplate; storageWarning?: boolean } | null;
  const routeTemplate = routeState && routeState.template?.id === id ? routeState.template : undefined;
  const template = useMemo(() => routeTemplate ?? findTemplate(id), [id, routeTemplate]);
  const [session, setSession] = useState<WorldCupPlaySession | null>(() =>
    template ? createPlaySession(template, template.targetSize ?? 8) : null,
  );
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [storageWarning, setStorageWarning] = useState(routeState?.storageWarning ? "브라우저 저장소에 저장되지 않은 월드컵입니다. 새로고침하면 사라질 수 있습니다." : "");

  useEffect(() => {
    setSession(template ? createPlaySession(template, template.targetSize ?? 8) : null);
  }, [template]);

  const choose = useCallback(
    (itemId: string): void => {
      if (!session || selectedId) {
        return;
      }
      setSelectedId(itemId);
      window.setTimeout(() => {
        const next = recordChoice(session, itemId);
        if (next.result) {
          const saved = saveResult(next.result);
          navigate(`/result/${next.result.id}`, { state: saved ? undefined : { result: next.result, storageWarning: true } });
          return;
        }
        setSession(next.session);
        setSelectedId(undefined);
      }, 180);
    },
    [navigate, selectedId, session],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (!session) {
        return;
      }
      const match = getActiveMatch(session);
      if (event.key === "a" || event.key === "A" || event.key === "ArrowLeft") {
        choose(match.left.id);
      }
      if (event.key === "d" || event.key === "D" || event.key === "ArrowRight") {
        choose(match.right.id);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [choose, session]);

  if (!template || !session) {
    return <EmptyState title="월드컵을 찾을 수 없습니다" description="삭제되었거나 이 브라우저에 저장되지 않은 월드컵입니다." actionLabel="홈으로" actionTo="/" />;
  }

  const match = getActiveMatch(session);
  const progress = getCurrentProgress(session);

  return (
    <div className="space-y-6">
      <section className={`coms-card p-5 ${session.currentRoundSize === 2 ? "final-glow" : ""}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="apple-eyebrow">{progress.roundLabel}</p>
            <h1 className="mt-2 break-words text-3xl font-black text-[var(--app-text)]">{template.title}</h1>
          </div>
          <div className="text-right">
            <p className="text-sm font-black text-[var(--app-text)]">현재 매치 {progress.matchNumber} / {progress.matchTotal}</p>
            <p className="mt-1 text-xs font-bold text-[var(--app-subtle)]">A/← 왼쪽, D/→ 오른쪽</p>
          </div>
        </div>
        <div className="mt-5">
          <ProgressBar value={progress.percent} />
        </div>
      </section>
      {storageWarning ? (
        <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700">
          {storageWarning}
          <button type="button" className="ml-2 underline" onClick={() => setStorageWarning("")}>
            닫기
          </button>
        </p>
      ) : null}

      <MatchView match={match} selectedId={selectedId} disabled={Boolean(selectedId)} onSelect={choose} />

      <div className="flex flex-wrap justify-between gap-3">
        <button type="button" className="coms-button-ghost" onClick={() => setSession(undoLastChoice(session))} disabled={session.choices.length === 0 || Boolean(selectedId)}>
          <RotateCcw size={16} /> 이전 선택 되돌리기
        </button>
        <button type="button" className="coms-button-ghost" onClick={() => navigate("/")}>
          <X size={16} /> 중도 포기
        </button>
      </div>
    </div>
  );
}
