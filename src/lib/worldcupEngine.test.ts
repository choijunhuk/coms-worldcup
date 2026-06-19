import { describe, expect, it } from "vitest";
import {
  calculateRankings,
  createPlaySession,
  createResultShareText,
  recordChoice,
  undoLastChoice,
} from "./worldcupEngine";
import type { WorldCupItem, WorldCupTemplate } from "../types/worldcup";

const items: WorldCupItem[] = [
  { id: "ts", name: "TypeScript", description: "타입이 있는 JS", tags: ["language"] },
  { id: "py", name: "Python", description: "빠른 실험", tags: ["language"] },
  { id: "rs", name: "Rust", description: "안전한 시스템", tags: ["language"] },
  { id: "go", name: "Go", description: "단순한 서버", tags: ["language"] },
];

const template: WorldCupTemplate = {
  id: "languages",
  title: "개발 언어 월드컵",
  description: "COMS에서 자주 말 나오는 언어",
  category: "language",
  items,
  createdAt: "2026-06-19T00:00:00.000Z",
  updatedAt: "2026-06-19T00:00:00.000Z",
  isSample: true,
};

describe("worldcupEngine", () => {
  it("creates a power-of-two first round and advances to a champion", () => {
    let session = createPlaySession(template, 4, { shuffle: false, now: () => "now" });

    expect(session.currentRoundSize).toBe(4);
    expect(session.rounds[0]).toHaveLength(2);

    session = recordChoice(session, "ts", { now: () => "1" }).session;
    expect(session.currentMatchIndex).toBe(1);

    session = recordChoice(session, "rs", { now: () => "2" }).session;
    expect(session.currentRoundSize).toBe(2);
    expect(session.rounds[1]).toHaveLength(1);

    const final = recordChoice(session, "ts", { now: () => "3" });
    expect(final.result?.winner.name).toBe("TypeScript");
    expect(final.result?.choices).toHaveLength(3);
  });

  it("undoes the latest choice across round boundaries", () => {
    let session = createPlaySession(template, 4, { shuffle: false, now: () => "now" });
    session = recordChoice(session, "ts", { now: () => "1" }).session;
    session = recordChoice(session, "rs", { now: () => "2" }).session;

    const undone = undoLastChoice(session);

    expect(undone.currentRoundSize).toBe(4);
    expect(undone.currentMatchIndex).toBe(1);
    expect(undone.choices).toHaveLength(1);
    expect(undone.rounds).toHaveLength(1);
  });

  it("calculates ranking rates from local results", () => {
    let session = createPlaySession(template, 4, { shuffle: false, now: () => "now" });
    session = recordChoice(session, "ts", { now: () => "1" }).session;
    session = recordChoice(session, "rs", { now: () => "2" }).session;
    const result = recordChoice(session, "ts", { now: () => "3" }).result;

    const rankings = calculateRankings(result ? [result] : [], template);
    const ts = rankings.find((ranking) => ranking.itemId === "ts");

    expect(ts?.wins).toBe(1);
    expect(ts?.finals).toBe(1);
    expect(ts?.selectedCount).toBe(2);
    expect(ts?.championRate).toBe(1);
  });

  it("creates COMS share text with the winner", () => {
    const text = createResultShareText(template.title, "TypeScript");

    expect(text).toContain("COMS 월드컵");
    expect(text).toContain("개발 언어 월드컵");
    expect(text).toContain("TypeScript");
  });
});
