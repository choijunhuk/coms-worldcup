import type {
  WorldCupChoice,
  WorldCupItem,
  WorldCupMatch,
  WorldCupPlaySession,
  WorldCupRanking,
  WorldCupResult,
  WorldCupRound,
  WorldCupTargetSize,
  WorldCupTemplate,
} from "../types/worldcup";
import { WORLD_CUP_TARGET_SIZES } from "../types/worldcup";

interface EngineOptions {
  shuffle?: boolean;
  now?: () => string;
  random?: () => number;
}

const defaultNow = (): string => new Date().toISOString();
const defaultRandom = (): number => Math.random();

const makeId = (prefix: string): string =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

const isWorldCupRound = (value: number): value is WorldCupRound =>
  value === 32 || value === 16 || value === 8 || value === 4 || value === 2;

const assertRound = (value: number): WorldCupRound => {
  if (!isWorldCupRound(value)) {
    throw new Error(`지원하지 않는 라운드 크기입니다: ${value}`);
  }
  return value;
};

export const getRoundLabel = (roundSize: WorldCupRound): string =>
  roundSize === 2 ? "결승" : `${roundSize}강`;

export const shuffleItems = (
  items: WorldCupItem[],
  random: () => number = defaultRandom,
): WorldCupItem[] => {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    const current = next[index];
    const swap = next[swapIndex];
    if (!current || !swap) {
      continue;
    }
    next[index] = swap;
    next[swapIndex] = current;
  }
  return next;
};

export const getPlayableTargetSizes = (itemCount: number): WorldCupTargetSize[] =>
  WORLD_CUP_TARGET_SIZES.filter((size) => size <= itemCount);

export const getMissingItemCount = (itemCount: number, targetSize: WorldCupTargetSize): number =>
  Math.max(0, targetSize - itemCount);

const createRoundMatches = (items: WorldCupItem[], roundSize: WorldCupRound): WorldCupMatch[] => {
  if (items.length !== roundSize) {
    throw new Error(`${getRoundLabel(roundSize)}에는 ${roundSize}개 항목이 필요합니다.`);
  }

  const matches: WorldCupMatch[] = [];
  for (let index = 0; index < items.length; index += 2) {
    const left = items[index];
    const right = items[index + 1];
    if (!left || !right) {
      throw new Error("월드컵 매치를 만들 수 없는 항목 수입니다.");
    }
    matches.push({
      id: makeId(`match-${roundSize}-${index / 2 + 1}`),
      roundSize,
      matchIndex: index / 2,
      left,
      right,
    });
  }
  return matches;
};

export const createPlaySession = (
  template: WorldCupTemplate,
  targetSize: WorldCupTargetSize = template.targetSize ?? 8,
  options: EngineOptions = {},
): WorldCupPlaySession => {
  if (!WORLD_CUP_TARGET_SIZES.includes(targetSize)) {
    throw new Error("4, 8, 16, 32강만 만들 수 있습니다.");
  }
  if (template.items.length < targetSize) {
    throw new Error(`${targetSize}강에는 항목이 ${targetSize}개 필요합니다.`);
  }

  const orderedItems =
    options.shuffle === false
      ? template.items.slice(0, targetSize)
      : shuffleItems(template.items, options.random).slice(0, targetSize);
  const roundSize = assertRound(targetSize);

  return {
    id: makeId("session"),
    templateId: template.id,
    templateTitle: template.title,
    startedAt: (options.now ?? defaultNow)(),
    currentRoundIndex: 0,
    currentRoundSize: roundSize,
    currentMatchIndex: 0,
    rounds: [createRoundMatches(orderedItems, roundSize)],
    choices: [],
  };
};

const cloneRounds = (rounds: WorldCupMatch[][]): WorldCupMatch[][] =>
  rounds.map((round) => round.map((match) => ({ ...match })));

const getCurrentMatch = (session: WorldCupPlaySession): WorldCupMatch => {
  const round = session.rounds[session.currentRoundIndex];
  const match = round?.[session.currentMatchIndex];
  if (!match) {
    throw new Error("현재 매치를 찾을 수 없습니다.");
  }
  return match;
};

const selectedPair = (
  match: WorldCupMatch,
  selectedId: string,
): { selected: WorldCupItem; rejected: WorldCupItem } => {
  if (match.left.id === selectedId) {
    return { selected: match.left, rejected: match.right };
  }
  if (match.right.id === selectedId) {
    return { selected: match.right, rejected: match.left };
  }
  throw new Error("현재 매치에 없는 항목을 선택했습니다.");
};

export const recordChoice = (
  session: WorldCupPlaySession,
  selectedId: string,
  options: EngineOptions = {},
): { session: WorldCupPlaySession; result?: WorldCupResult } => {
  const now = (options.now ?? defaultNow)();
  const rounds = cloneRounds(session.rounds);
  const currentRound = rounds[session.currentRoundIndex];
  const match = currentRound?.[session.currentMatchIndex];
  if (!currentRound || !match) {
    throw new Error("현재 라운드를 찾을 수 없습니다.");
  }

  const { selected, rejected } = selectedPair(match, selectedId);
  match.winnerId = selected.id;

  const choice: WorldCupChoice = {
    matchId: match.id,
    roundSize: match.roundSize,
    matchIndex: match.matchIndex,
    selectedId: selected.id,
    selectedName: selected.name,
    rejectedId: rejected.id,
    rejectedName: rejected.name,
    chosenAt: now,
  };
  const choices = [...session.choices, choice];
  const isLastMatchInRound = session.currentMatchIndex === currentRound.length - 1;

  if (!isLastMatchInRound) {
    return {
      session: {
        ...session,
        rounds,
        choices,
        currentMatchIndex: session.currentMatchIndex + 1,
      },
    };
  }

  const winners = currentRound.map((roundMatch) => {
    const winnerId = roundMatch.winnerId;
    if (!winnerId) {
      throw new Error("라운드 승자가 누락되었습니다.");
    }
    return selectedPair(roundMatch, winnerId).selected;
  });

  if (winners.length === 1) {
    const completedSession: WorldCupPlaySession = {
      ...session,
      rounds,
      choices,
    };
    const result: WorldCupResult = {
      id: makeId("result"),
      templateId: session.templateId,
      templateTitle: session.templateTitle,
      winner: winners[0] as WorldCupItem,
      finalMatch: match,
      choices,
      completedAt: now,
    };
    return { session: completedSession, result };
  }

  const nextRoundSize = assertRound(winners.length);
  const nextRound = createRoundMatches(winners, nextRoundSize);

  return {
    session: {
      ...session,
      rounds: [...rounds, nextRound],
      choices,
      currentRoundIndex: session.currentRoundIndex + 1,
      currentRoundSize: nextRoundSize,
      currentMatchIndex: 0,
    },
  };
};

export const undoLastChoice = (session: WorldCupPlaySession): WorldCupPlaySession => {
  if (session.choices.length === 0) {
    return session;
  }

  const rounds = cloneRounds(session.rounds);
  const choices = session.choices.slice(0, -1);

  if (session.currentMatchIndex > 0) {
    const currentRound = rounds[session.currentRoundIndex];
    const previousMatch = currentRound?.[session.currentMatchIndex - 1];
    if (!currentRound || !previousMatch) {
      return session;
    }
    previousMatch.winnerId = undefined;
    return {
      ...session,
      rounds,
      choices,
      currentMatchIndex: session.currentMatchIndex - 1,
    };
  }

  if (session.currentRoundIndex > 0) {
    const previousRoundIndex = session.currentRoundIndex - 1;
    const previousRound = rounds[previousRoundIndex];
    const previousMatchIndex = previousRound ? previousRound.length - 1 : 0;
    const previousMatch = previousRound?.[previousMatchIndex];
    if (!previousRound || !previousMatch) {
      return session;
    }
    previousMatch.winnerId = undefined;
    rounds.splice(session.currentRoundIndex, 1);
    return {
      ...session,
      rounds,
      choices,
      currentRoundIndex: previousRoundIndex,
      currentRoundSize: previousMatch.roundSize,
      currentMatchIndex: previousMatchIndex,
    };
  }

  const firstMatch = rounds[0]?.[0];
  if (firstMatch) {
    firstMatch.winnerId = undefined;
  }
  return {
    ...session,
    rounds,
    choices,
    currentMatchIndex: 0,
  };
};

export const getCurrentProgress = (
  session: WorldCupPlaySession,
): { roundLabel: string; matchNumber: number; matchTotal: number; percent: number } => {
  const round = session.rounds[session.currentRoundIndex] ?? [];
  const completedBeforeRound = session.rounds
    .slice(0, session.currentRoundIndex)
    .reduce((sum, current) => sum + current.length, 0);
  const totalMatches = session.rounds[0]?.length
    ? session.rounds[0].length * 2 - 1
    : 1;
  const completedMatches = completedBeforeRound + session.currentMatchIndex;

  return {
    roundLabel: getRoundLabel(session.currentRoundSize),
    matchNumber: session.currentMatchIndex + 1,
    matchTotal: round.length,
    percent: Math.min(100, Math.round((completedMatches / totalMatches) * 100)),
  };
};

export const getActiveMatch = (session: WorldCupPlaySession): WorldCupMatch => getCurrentMatch(session);

export const calculateRankings = (
  results: WorldCupResult[],
  template: WorldCupTemplate,
): WorldCupRanking[] => {
  const stats = new Map<
    string,
    { itemName: string; wins: number; finals: number; selectedCount: number; losses: number }
  >();

  template.items.forEach((item) => {
    stats.set(item.id, {
      itemName: item.name,
      wins: 0,
      finals: 0,
      selectedCount: 0,
      losses: 0,
    });
  });

  const matchingResults = results.filter((result) => result.templateId === template.id);
  matchingResults.forEach((result) => {
    const winner = stats.get(result.winner.id);
    if (winner) {
      winner.wins += 1;
    }

    const finalChoice = result.choices.at(-1);
    if (finalChoice) {
      const selectedFinalist = stats.get(finalChoice.selectedId);
      const rejectedFinalist = stats.get(finalChoice.rejectedId);
      if (selectedFinalist) {
        selectedFinalist.finals += 1;
      }
      if (rejectedFinalist) {
        rejectedFinalist.finals += 1;
      }
    }

    result.choices.forEach((choice) => {
      const selected = stats.get(choice.selectedId);
      const rejected = stats.get(choice.rejectedId);
      if (selected) {
        selected.selectedCount += 1;
      }
      if (rejected) {
        rejected.losses += 1;
      }
    });
  });

  return Array.from(stats.entries())
    .map(([itemId, value]) => {
      const duels = value.selectedCount + value.losses;
      return {
        itemId,
        itemName: value.itemName,
        wins: value.wins,
        finals: value.finals,
        selectedCount: value.selectedCount,
        losses: value.losses,
        winRate: duels === 0 ? 0 : value.selectedCount / duels,
        championRate: matchingResults.length === 0 ? 0 : value.wins / matchingResults.length,
      };
    })
    .sort((a, b) => b.wins - a.wins || b.finals - a.finals || b.selectedCount - a.selectedCount);
};

export const createResultShareText = (templateTitle: string, winnerName: string): string =>
  `COMS 월드컵 '${templateTitle}'에서 내 우승자는 ${winnerName}!`;
