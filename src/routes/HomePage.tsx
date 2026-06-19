import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { sampleWorldCups } from "../lib/sampleData";
import { getStoredTemplates } from "../lib/storage";
import { WorldCupList } from "../components/WorldCupList";

export function HomePage() {
  const [query, setQuery] = useState("");
  const storedTemplates = getStoredTemplates();
  const allTemplates = useMemo(() => [...storedTemplates, ...sampleWorldCups], [storedTemplates]);
  const filteredTemplates = allTemplates.filter((template) => {
    const haystack = `${template.title} ${template.description} ${template.category}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });

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
          <div id="samples">
            <WorldCupList title="샘플 월드컵" templates={sampleWorldCups} emptyText="샘플을 불러오지 못했습니다." />
          </div>
        </>
      )}
    </div>
  );
}
