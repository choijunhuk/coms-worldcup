import { RotateCcw, Share2, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { mediaFromInput } from "../lib/media";
import type { WorldCupResult } from "../types/worldcup";

interface ResultCardProps {
  result: WorldCupResult;
  shareText: string;
  onCopy: () => void;
}

export function ResultCard({ result, shareText, onCopy }: ResultCardProps) {
  const winnerMedia = result.winner.media ?? mediaFromInput(result.winner.imageUrl);

  return (
    <section className="coms-card overflow-hidden">
      <div className="grid gap-8 p-6 md:grid-cols-[0.9fr_1.1fr] md:p-8">
        {/* Winner visual panel */}
        <div className="winner-orbit grid aspect-square place-items-center rounded-lg">
          <div className="text-center">
            <Trophy className="mx-auto text-[var(--app-accent)]" size={58} strokeWidth={1.7} />
            {winnerMedia?.type === "youtube" ? (
              <iframe
                className="mx-auto mt-4 aspect-video w-full max-w-sm rounded-lg"
                src={winnerMedia.embedUrl}
                title={`${result.winner.name} YouTube preview`}
                loading="lazy"
              />
            ) : winnerMedia ? (
              <img
                className="mx-auto mt-4 aspect-video w-full max-w-sm rounded-lg object-cover"
                src={winnerMedia.url}
                alt=""
              />
            ) : null}
            <p className="mt-4 text-sm font-black text-[var(--app-accent-text)]">최종 우승</p>
            <h1 className="mt-2 break-words text-4xl font-black leading-tight text-[var(--app-text)] sm:text-5xl">
              {result.winner.name}
            </h1>
          </div>
        </div>

        {/* Share panel */}
        <div className="flex flex-col justify-center">
          <p className="text-sm font-bold text-[var(--app-muted)]">{result.templateTitle}</p>
          <h2 className="mt-3 text-3xl font-black text-[var(--app-text)]">공유하고 싶은 결과가 나왔습니다.</h2>
          <p className="mt-4 rounded-lg bg-[var(--app-surface-soft)] px-4 py-4 text-base font-bold leading-7 text-[var(--app-text)] border border-[var(--app-hairline)]">
            {shareText}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" className="coms-button-primary" onClick={onCopy}>
              <Share2 size={16} /> 결과 복사
            </button>
            <Link className="coms-button-ghost" to={`/play/${result.templateId}`}>
              <RotateCcw size={16} /> 다시 하기
            </Link>
            <Link className="coms-button-ghost" to={`/ranking/${result.templateId}`}>
              랭킹 보기
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
