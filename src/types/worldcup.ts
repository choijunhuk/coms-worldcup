export const WORLD_CUP_TARGET_SIZES = [4, 8, 16, 32] as const;

export type WorldCupTargetSize = (typeof WORLD_CUP_TARGET_SIZES)[number];
export type WorldCupRound = 32 | 16 | 8 | 4 | 2;

export type WorldCupCategory =
  | "language"
  | "framework"
  | "project"
  | "seminar"
  | "food"
  | "meme"
  | "error"
  | "activity"
  | "custom";

export interface WorldCupItem {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  tags: string[];
}

export interface WorldCupTemplate {
  id: string;
  title: string;
  description: string;
  category: WorldCupCategory;
  items: WorldCupItem[];
  targetSize?: WorldCupTargetSize;
  createdAt: string;
  updatedAt: string;
  isSample?: boolean;
}

export interface WorldCupMatch {
  id: string;
  roundSize: WorldCupRound;
  matchIndex: number;
  left: WorldCupItem;
  right: WorldCupItem;
  winnerId?: string;
}

export interface WorldCupChoice {
  matchId: string;
  roundSize: WorldCupRound;
  matchIndex: number;
  selectedId: string;
  selectedName: string;
  rejectedId: string;
  rejectedName: string;
  chosenAt: string;
}

export interface WorldCupPlaySession {
  id: string;
  templateId: string;
  templateTitle: string;
  startedAt: string;
  currentRoundIndex: number;
  currentRoundSize: WorldCupRound;
  currentMatchIndex: number;
  rounds: WorldCupMatch[][];
  choices: WorldCupChoice[];
}

export interface WorldCupResult {
  id: string;
  templateId: string;
  templateTitle: string;
  winner: WorldCupItem;
  finalMatch: WorldCupMatch;
  choices: WorldCupChoice[];
  completedAt: string;
}

export interface WorldCupRanking {
  itemId: string;
  itemName: string;
  wins: number;
  finals: number;
  selectedCount: number;
  losses: number;
  winRate: number;
  championRate: number;
}
