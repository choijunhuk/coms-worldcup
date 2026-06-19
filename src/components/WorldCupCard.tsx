import { useState } from "react";
import type { WorldCupItem } from "../types/worldcup";

interface WorldCupCardProps {
  item: WorldCupItem;
  side?: "left" | "right";
  selected?: boolean;
  disabled?: boolean;
  onSelect?: (itemId: string) => void;
}

export function WorldCupCard({ item, side, selected = false, disabled = false, onSelect }: WorldCupCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const initial = item.name.trim().charAt(0) || "C";

  return (
    <button
      type="button"
      className={`worldcup-card group text-left ${selected ? "worldcup-card-selected" : ""}`}
      disabled={disabled}
      onClick={() => onSelect?.(item.id)}
      aria-label={`${side === "left" ? "왼쪽" : side === "right" ? "오른쪽" : "항목"} 선택: ${item.name}`}
    >
      <div className="aspect-[4/3] overflow-hidden rounded-lg bg-[var(--app-surface-soft)]">
        {item.imageUrl && !imageFailed ? (
          <img
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            src={item.imageUrl}
            alt=""
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="grid h-full place-items-center bg-[linear-gradient(135deg,var(--app-accent-soft),#fff)] text-6xl font-black text-[var(--app-accent-text)]">
            {initial}
          </div>
        )}
      </div>
      <div className="mt-4 min-w-0">
        <p className="break-words text-xl font-black leading-7 text-[var(--app-text)]">{item.name}</p>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-[var(--app-muted)]">{item.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {item.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="rounded-full bg-[var(--app-accent-soft)] px-2.5 py-1 text-xs font-bold text-[var(--app-accent-text)]">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}
