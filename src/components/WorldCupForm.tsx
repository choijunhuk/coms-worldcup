import { Plus, Sparkles, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { mediaFromInput } from "../lib/media";
import { uploadMediaFile } from "../lib/miniApi";
import { sampleWorldCupItems } from "../lib/sampleData";
import { getMissingItemCount, getPlayableTargetSizes } from "../lib/worldcupEngine";
import type { WorldCupCategory, WorldCupItem, WorldCupTargetSize, WorldCupTemplate } from "../types/worldcup";
import { WORLD_CUP_TARGET_SIZES } from "../types/worldcup";

interface WorldCupFormProps {
  onSubmit: (template: WorldCupTemplate) => void;
}

const categories: { value: WorldCupCategory; label: string }[] = [
  { value: "language", label: "개발 언어" },
  { value: "framework", label: "프레임워크" },
  { value: "project", label: "프로젝트" },
  { value: "seminar", label: "세미나 주제" },
  { value: "food", label: "야식 메뉴" },
  { value: "meme", label: "개발자 밈" },
  { value: "error", label: "에러 메시지" },
  { value: "activity", label: "동아리 활동" },
  { value: "custom", label: "직접 입력" },
];

const createDraftItem = (index: number): WorldCupItem => ({
  id: `item-${Date.now().toString(36)}-${index}`,
  name: "",
  description: "",
  imageUrl: "",
  tags: [],
});

export function WorldCupForm({ onSubmit }: WorldCupFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<WorldCupCategory>("language");
  const [targetSize, setTargetSize] = useState<WorldCupTargetSize>(8);
  const [items, setItems] = useState<WorldCupItem[]>([0, 1, 2, 3].map(createDraftItem));
  const [uploadingId, setUploadingId] = useState<string | undefined>();
  const [uploadError, setUploadError] = useState("");

  const validItems = items.filter((item) => item.name.trim().length > 0);
  const playableSizes = getPlayableTargetSizes(validItems.length);
  const missingCount = getMissingItemCount(validItems.length, targetSize);
  const canSubmit = title.trim().length > 0 && description.trim().length > 0 && validItems.length >= 4 && missingCount === 0;

  const guidance = useMemo(() => {
    if (validItems.length < 4) {
      return "최소 4개 항목이 필요합니다.";
    }
    if (missingCount > 0) {
      return `${targetSize}강을 만들려면 항목 ${missingCount}개를 더 채워야 합니다.`;
    }
    return `${targetSize}강 생성 가능. 현재 ${playableSizes.join(", ")}강을 지원합니다.`;
  }, [missingCount, playableSizes, targetSize, validItems.length]);

  const updateItem = (id: string, patch: Partial<WorldCupItem>): void => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const setMediaUrl = (id: string, value: string): void => {
    updateItem(id, { imageUrl: value, media: mediaFromInput(value) });
  };

  const uploadItemMedia = async (item: WorldCupItem, file: File | undefined): Promise<void> => {
    if (!file) {
      return;
    }
    setUploadingId(item.id);
    setUploadError("");
    try {
      const url = await uploadMediaFile(file, item.name || "월드컵 항목");
      setMediaUrl(item.id, url);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "미디어 업로드에 실패했습니다.");
    } finally {
      setUploadingId(undefined);
    }
  };

  const addSampleItems = (): void => {
    setItems(sampleWorldCupItems.map((sample, index) => ({ ...sample, id: `${sample.id}-${index}` })));
    setTargetSize(8);
    if (!title) {
      setTitle("개발 언어 월드컵");
      setDescription("COMS 구성원이 가장 좋아하는 개발 언어를 고릅니다.");
      setCategory("language");
    }
  };

  const submit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }
    const now = new Date().toISOString();
    onSubmit({
      id: `worldcup-${Date.now().toString(36)}`,
      title: title.trim(),
      description: description.trim(),
      category,
      targetSize,
      items: validItems.slice(0, targetSize).map((item, index) => ({
        ...item,
        id: item.id || `item-${index}`,
        name: item.name.trim(),
        description: item.description.trim() || "설명이 아직 없습니다.",
        imageUrl: item.imageUrl?.trim() || undefined,
        media: item.media ?? mediaFromInput(item.imageUrl),
        tags: item.tags,
      })),
      createdAt: now,
      updatedAt: now,
    });
  };

  return (
    <form className="space-y-6" onSubmit={submit}>
      <section className="coms-card grid gap-4 p-5 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-bold text-[var(--app-text)]">제목</span>
          <input className="coms-input" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="예: 개발 언어 월드컵" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-bold text-[var(--app-text)]">카테고리</span>
          <select className="coms-input" value={category} onChange={(event) => setCategory(event.target.value as WorldCupCategory)}>
            {categories.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-bold text-[var(--app-text)]">설명</span>
          <textarea className="coms-input min-h-28 resize-y py-3" value={description} onChange={(event) => setDescription(event.target.value)} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-bold text-[var(--app-text)]">항목 개수</span>
          <select className="coms-input" value={targetSize} onChange={(event) => setTargetSize(Number(event.target.value) as WorldCupTargetSize)}>
            {WORLD_CUP_TARGET_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}강
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-end">
          <button type="button" className="coms-button-ghost min-h-11" onClick={addSampleItems}>
            <Sparkles size={16} /> 샘플 항목 자동 추가
          </button>
        </div>
        <p className={`md:col-span-2 rounded-lg px-4 py-3 text-sm font-bold ${canSubmit ? "bg-emerald-50 text-emerald-700" : "bg-[var(--app-accent-soft)] text-[var(--app-accent-text)]"}`}>
          {guidance}
        </p>
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-black text-[var(--app-text)]">항목 목록</h2>
          <button type="button" className="coms-button-primary" onClick={() => setItems((current) => [...current, createDraftItem(current.length)])}>
            <Plus size={16} /> 항목 추가
          </button>
        </div>
        <div className="grid gap-3">
          {uploadError ? <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700">{uploadError}</p> : null}
          {items.map((item, index) => (
            <article key={item.id} className="coms-card grid gap-3 p-4 lg:grid-cols-[1fr_1.2fr_1fr_1fr_auto]">
              <input className="coms-input" value={item.name} onChange={(event) => updateItem(item.id, { name: event.target.value })} placeholder={`항목 ${index + 1} 이름`} />
              <input className="coms-input" value={item.description} onChange={(event) => updateItem(item.id, { description: event.target.value })} placeholder="짧은 설명" />
              <div className="grid gap-2">
                <input className="coms-input" value={item.imageUrl ?? ""} onChange={(event) => setMediaUrl(item.id, event.target.value)} placeholder="이미지/GIF/YouTube URL" />
                <label className="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-lg border border-[var(--app-hairline)] bg-[var(--app-surface)] px-3 text-xs font-black text-[var(--app-muted)] transition hover:bg-[var(--app-surface-soft)]">
                  {uploadingId === item.id ? "업로드 중..." : "파일 업로드"}
                  <input className="sr-only" type="file" accept="image/*,.gif" onChange={(event) => void uploadItemMedia(item, event.target.files?.[0])} />
                </label>
              </div>
              <input
                className="coms-input"
                value={item.tags.join(", ")}
                onChange={(event) => updateItem(item.id, { tags: event.target.value.split(",").map((tag) => tag.trim()).filter(Boolean) })}
                placeholder="태그, 쉼표로 구분"
              />
              <button type="button" className="coms-icon-button" onClick={() => setItems((current) => current.filter((target) => target.id !== item.id))} aria-label={`${item.name || "항목"} 삭제`}>
                <Trash2 size={16} />
              </button>
            </article>
          ))}
        </div>
      </section>

      <div className="flex justify-end">
        <button type="submit" className="coms-button-primary min-h-12 px-6" disabled={!canSubmit}>
          월드컵 만들기
        </button>
      </div>
    </form>
  );
}
