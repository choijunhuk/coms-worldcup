import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sampleWorldCups } from "../lib/sampleData";
import { listProfileDocuments, listSharedDocuments } from "../lib/miniApi";
import type { MiniDocument } from "../lib/miniApi";
import { getStoredTemplates } from "../lib/storage";
import { WorldCupList } from "../components/WorldCupList";
import type { WorldCupResult, WorldCupTemplate } from "../types/worldcup";

type WorldCupPayload = WorldCupTemplate | WorldCupResult;

const isTemplate = (payload: WorldCupPayload): payload is WorldCupTemplate => "items" in payload && "title" in payload;
const isResult = (payload: WorldCupPayload): payload is WorldCupResult => "winner" in payload && "choices" in payload;

export function HomePage() {
  const [query, setQuery] = useState("");
  const [profileDocs, setProfileDocs] = useState<MiniDocument<WorldCupPayload>[]>([]);
  const [sharedDocs, setSharedDocs] = useState<MiniDocument<WorldCupPayload>[]>([]);
  const navigate = useNavigate();
  const storedTemplates = getStoredTemplates();
  const allTemplates = useMemo(() => [...storedTemplates, ...sampleWorldCups], [storedTemplates]);
  const filteredTemplates = allTemplates.filter((template) => {
    const haystack = `${template.title} ${template.description} ${template.category}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });

  useEffect(() => {
    listSharedDocuments().then(setSharedDocs).catch(() => setSharedDocs([]));
    listProfileDocuments().then(setProfileDocs).catch(() => setProfileDocs([]));
  }, []);

  const openProfileDoc = (doc: MiniDocument<WorldCupPayload>): void => {
    if (isTemplate(doc.payload)) {
      navigate(`/play/${doc.payload.id}`, { state: { template: doc.payload } });
      return;
    }
    if (isResult(doc.payload)) {
      navigate(`/result/${doc.payload.id}`, { state: { result: doc.payload } });
    }
  };

  return (
    <div className="space-y-10">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div>
          <p className="apple-eyebrow">COMS mini game</p>
          <h1 className="mt-3 max-w-3xl text-5xl font-black leading-tight text-[var(--app-text)] sm:text-6xl">둘 중 하나를 고르다 보면 취향이 드러납니다.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--app-muted)]">
            COMS 안에서 개발 언어, 프레임워크, 야식 메뉴, 에러 메시지, 세미나 주제를 월드컵으로 가볍게 뽑아보세요.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link className="coms-button-primary min-h-12 px-5" to="/create">
              월드컵 만들기
            </Link>
            <a className="coms-button-ghost min-h-12 px-5" href="#samples">
              샘플 보기
            </a>
          </div>
        </div>
        <div className="coms-card p-5">
          <div className="worldcup-bracket">
            {["32강", "16강", "8강", "4강", "결승"].map((label, index) => (
              <div key={label} className="bracket-step" style={{ ["--delay" as string]: `${index * 80}ms` }}>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="coms-card p-4">
        <label className="flex items-center gap-3">
          <Search size={18} className="text-[var(--app-subtle)]" />
          <input
            className="h-11 flex-1 bg-transparent text-base font-semibold outline-none placeholder:text-[var(--app-subtle)]"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="언어, 프레임워크, 야식, 에러 메시지 검색"
          />
        </label>
      </section>

      {query ? (
        <WorldCupList title="검색 결과" templates={filteredTemplates} emptyText="조건에 맞는 월드컵이 없습니다." />
      ) : (
        <>
          <WorldCupList title="최근 만든 월드컵" templates={storedTemplates} emptyText="아직 직접 만든 월드컵이 없습니다." />
          <ServerWorldCupList title="내 프로필 저장" docs={profileDocs} emptyText="로그인 후 만든 월드컵과 결과가 여기에 저장됩니다." onOpen={openProfileDoc} />
          <ServerWorldCupList title="COMS 공유 월드컵" docs={sharedDocs} emptyText="아직 공유된 월드컵이 없습니다." />
          <div id="samples">
            <WorldCupList title="샘플 월드컵" templates={sampleWorldCups} emptyText="샘플을 불러오지 못했습니다." />
          </div>
        </>
      )}
    </div>
  );
}

interface ServerWorldCupListProps {
  title: string;
  docs: MiniDocument<WorldCupPayload>[];
  emptyText: string;
  onOpen?: (doc: MiniDocument<WorldCupPayload>) => void;
}

function ServerWorldCupList({ title, docs, emptyText, onOpen }: ServerWorldCupListProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-xl font-black text-[var(--app-text)]">{title}</h2>
        <span className="text-xs font-bold text-[var(--app-subtle)]">{docs.length}개</span>
      </div>
      {docs.length === 0 ? (
        <div className="coms-card px-5 py-8 text-center text-sm font-semibold text-[var(--app-muted)]">{emptyText}</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {docs.map((doc) => (
            <article key={`${doc.contentType}-${doc.contentId}`} className="coms-card flex min-h-52 flex-col p-5">
              <p className="text-xs font-bold uppercase text-[var(--app-accent-text)]">{doc.contentType === "result" ? "결과" : "템플릿"} · {doc.ownerName || doc.ownerStudentId}</p>
              <h3 className="mt-2 break-words text-xl font-black leading-7 text-[var(--app-text)]">{doc.title}</h3>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--app-muted)]">{doc.description || "설명이 없습니다."}</p>
              <div className="mt-auto pt-5">
                {doc.shared && doc.shareUrl ? (
                  <Link className="coms-button-primary" to={doc.shareUrl.replace("/worldcup", "")}>
                    공유 링크 열기
                  </Link>
                ) : (
                  <button type="button" className="coms-button-primary" onClick={() => onOpen?.(doc)}>
                    열기
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
