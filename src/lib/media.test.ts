import { describe, expect, it } from "vitest";
import { mediaFromInput, youtubeEmbedUrl } from "./media";

describe("worldcup media helpers", () => {
  it("detects uploaded/static images and gifs", () => {
    expect(mediaFromInput("/api/files/1/inline")).toEqual({ type: "image", url: "/api/files/1/inline" });
    expect(mediaFromInput("https://example.com/win.gif")).toEqual({ type: "gif", url: "https://example.com/win.gif" });
  });

  it("converts youtube watch and short links to embeds", () => {
    expect(youtubeEmbedUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ");
    expect(mediaFromInput("https://youtu.be/dQw4w9WgXcQ?si=test")).toEqual({
      type: "youtube",
      url: "https://youtu.be/dQw4w9WgXcQ?si=test",
      embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    });
  });
});
