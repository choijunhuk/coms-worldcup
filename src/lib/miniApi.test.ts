import { afterEach, describe, expect, it, vi } from "vitest";
import { toMiniDocumentRequest, uploadMediaFile } from "./miniApi";
import type { WorldCupResult } from "../types/worldcup";

const result: WorldCupResult = {
  id: "result-a",
  templateId: "template-a",
  templateTitle: "개발 언어 월드컵",
  winner: { id: "ts", name: "TypeScript", description: "타입", tags: ["lang"] },
  finalMatch: {
    id: "final",
    roundSize: 2,
    matchIndex: 0,
    left: { id: "ts", name: "TypeScript", description: "타입", tags: [] },
    right: { id: "py", name: "Python", description: "파이썬", tags: [] },
  },
  choices: [],
  completedAt: "now",
};

describe("worldcup mini API helpers", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("wraps results as mini-app document payloads", () => {
    expect(toMiniDocumentRequest(result, false)).toEqual({
      title: "개발 언어 월드컵",
      description: "우승자: TypeScript",
      shared: false,
      payload: result,
    });
  });

  it("uploads media through the COMS file API and returns an inline URL", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: 42 }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const url = await uploadMediaFile(new File(["gif"], "clip.gif", { type: "image/gif" }), "테스트");

    expect(url).toBe("/api/files/42/inline");
    expect(fetchMock).toHaveBeenCalledWith("/api/files", expect.objectContaining({ method: "POST", credentials: "include" }));
  });
});
