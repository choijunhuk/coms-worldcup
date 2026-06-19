import type { WorldCupMatch } from "../types/worldcup";
import { WorldCupCard } from "./WorldCupCard";

interface MatchViewProps {
  match: WorldCupMatch;
  selectedId?: string;
  disabled?: boolean;
  onSelect: (itemId: string) => void;
}

export function MatchView({ match, selectedId, disabled = false, onSelect }: MatchViewProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
      <WorldCupCard item={match.left} side="left" selected={selectedId === match.left.id} disabled={disabled} onSelect={onSelect} />
      <div className="grid place-items-center">
        <span className="rounded-full border border-[var(--app-hairline)] bg-[var(--app-surface)] px-4 py-2 text-sm font-black text-[var(--app-muted)] shadow-sm">
          VS
        </span>
      </div>
      <WorldCupCard item={match.right} side="right" selected={selectedId === match.right.id} disabled={disabled} onSelect={onSelect} />
    </div>
  );
}
