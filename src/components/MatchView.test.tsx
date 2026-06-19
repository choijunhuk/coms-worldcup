/// <reference types="node" />

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MatchView } from "./MatchView";
import type { WorldCupMatch } from "../types/worldcup";

const match: WorldCupMatch = {
  id: "round-8-match-0",
  roundSize: 8,
  matchIndex: 0,
  left: { id: "left", name: "왼쪽 후보", description: "비교할 때 크게 보여야 하는 항목", tags: ["left"] },
  right: { id: "right", name: "오른쪽 후보", description: "비교할 때 크게 보여야 하는 항목", tags: ["right"] },
};

const stylesheet = readFileSync(fileURLToPath(new URL("../index.css", import.meta.url)), "utf8");

describe("MatchView comparison layout", () => {
  it("opts into the large comparison stage", () => {
    const markup = renderToStaticMarkup(<MatchView match={match} onSelect={() => undefined} />);

    expect(markup).toContain("match-view");
  });

  it("keeps comparison cards large and zoomable", () => {
    expect(stylesheet).toMatch(/\.match-view\s*\{[\s\S]*width:\s*min\(calc\(100vw - 2rem\),\s*88rem\)/);
    expect(stylesheet).toMatch(/\.match-view\s+\.worldcup-card\s*\{[\s\S]*min-height:\s*clamp\(32rem,\s*54vw,\s*40rem\)/);
    expect(stylesheet).toMatch(/\.worldcup-card:not\(:disabled\):is\(:hover,\s*:focus-visible\)\s*\{[\s\S]*scale\(1\.025\)/);
    expect(stylesheet).toMatch(/\.worldcup-card:not\(:disabled\):is\(:hover,\s*:focus-visible\)\s+\.worldcup-media\s+>\s+:is\(img,\s*iframe,\s*div\)\s*\{[\s\S]*scale\(1\.075\)/);
  });
});
