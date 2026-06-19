import type { WorldCupResult } from "../types/worldcup";
import { createResultShareText } from "./worldcupEngine";

export const createWorldCupShareText = (result: WorldCupResult): string =>
  createResultShareText(result.templateTitle, result.winner.name);

export const copyText = async (text: string): Promise<boolean> => {
  if (typeof navigator === "undefined" || !navigator.clipboard) {
    return false;
  }
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};
