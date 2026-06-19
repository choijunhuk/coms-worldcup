import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { WorldCupForm } from "../components/WorldCupForm";
import { trySaveProfileDocument } from "../lib/miniApi";
import { saveTemplate } from "../lib/storage";
import type { WorldCupTemplate } from "../types/worldcup";

export function CreateWorldCupPage() {
  const navigate = useNavigate();
  const [saveError, setSaveError] = useState("");

  const handleSubmit = (template: WorldCupTemplate): void => {
    const saved = saveTemplate(template);
    void trySaveProfileDocument("template", template);
    setSaveError(saved ? "" : "브라우저 저장소에 저장하지 못했습니다. 지금 만든 월드컵은 이 화면 흐름에서만 이어집니다.");
    navigate(`/play/${template.id}`, { state: saved ? undefined : { template, storageWarning: true } });
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="apple-eyebrow">Create</p>
        <h1 className="mt-3 text-4xl font-black text-[var(--app-text)]">월드컵 만들기</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--app-muted)]">
          최소 4개 항목부터 시작할 수 있고, 항목 수에 맞춰 4강, 8강, 16강, 32강을 선택할 수 있습니다.
        </p>
      </header>
      {saveError ? <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700">{saveError}</p> : null}
      <WorldCupForm onSubmit={handleSubmit} />
    </div>
  );
}
