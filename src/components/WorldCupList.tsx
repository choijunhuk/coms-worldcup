import { Link } from "react-router-dom";
import { Trophy } from "lucide-react";
import type { WorldCupTemplate } from "../types/worldcup";

interface WorldCupListProps {
  title: string;
  templates: WorldCupTemplate[];
  emptyText: string;
}

export function WorldCupList({ title, templates, emptyText }: WorldCupListProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-xl font-black text-[var(--app-text)]">{title}</h2>
        <span className="text-xs font-bold text-[var(--app-subtle)]">{templates.length}개</span>
      </div>
      {templates.length === 0 ? (
        <div className="coms-card px-5 py-8 text-center text-sm font-semibold text-[var(--app-muted)]">{emptyText}</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {templates.map((template) => (
            <article key={template.id} className="coms-card flex min-h-56 flex-col p-5 transition hover:-translate-y-0.5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase text-[var(--app-accent-text)]">{template.category}</p>
                  <h3 className="mt-2 break-words text-xl font-black leading-7 text-[var(--app-text)]">{template.title}</h3>
                </div>
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--app-accent-soft)] text-[var(--app-accent-text)]">
                  <Trophy size={18} />
                </span>
              </div>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--app-muted)]">{template.description}</p>
              <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                <span className="text-xs font-bold text-[var(--app-subtle)]">{template.items.length}개 항목</span>
                <div className="flex gap-2">
                  <Link className="coms-button-ghost" to={`/ranking/${template.id}`}>
                    랭킹
                  </Link>
                  <Link className="coms-button-primary" to={`/play/${template.id}`}>
                    시작
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
