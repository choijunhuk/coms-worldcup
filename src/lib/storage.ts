import type { WorldCupResult, WorldCupTemplate } from "../types/worldcup";

const TEMPLATE_KEY = "coms-worldcup:templates";
const RESULT_KEY = "coms-worldcup:results";

const storage = (): Storage | undefined => {
  try {
    return typeof window === "undefined" ? undefined : window.localStorage;
  } catch {
    return undefined;
  }
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isString = (value: unknown): value is string => typeof value === "string";

const isWorldCupItem = (value: unknown): boolean => {
  if (!isRecord(value)) {
    return false;
  }
  return isString(value.id) && isString(value.name) && isString(value.description) && Array.isArray(value.tags);
};

const isWorldCupTemplate = (value: unknown): value is WorldCupTemplate => {
  if (!isRecord(value)) {
    return false;
  }
  return (
    isString(value.id) &&
    isString(value.title) &&
    isString(value.description) &&
    isString(value.category) &&
    isString(value.createdAt) &&
    isString(value.updatedAt) &&
    Array.isArray(value.items) &&
    value.items.every(isWorldCupItem)
  );
};

const isWorldCupResult = (value: unknown): value is WorldCupResult => {
  if (!isRecord(value)) {
    return false;
  }
  return (
    isString(value.id) &&
    isString(value.templateId) &&
    isString(value.templateTitle) &&
    isWorldCupItem(value.winner) &&
    Array.isArray(value.choices) &&
    isString(value.completedAt)
  );
};

const removeKey = (key: string): void => {
  const target = storage();
  if (!target) {
    return;
  }
  try {
    target.removeItem(key);
  } catch {
    // Blocked storage cleanup should not break rendering.
  }
};

const readArray = <T>(key: string, validate: (value: unknown) => value is T): T[] => {
  const target = storage();
  if (!target) {
    return [];
  }

  let raw: string | null;
  try {
    raw = target.getItem(key);
  } catch {
    return [];
  }

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed) || !parsed.every(validate)) {
      removeKey(key);
      return [];
    }
    return parsed;
  } catch {
    removeKey(key);
    return [];
  }
};

const writeJson = <T>(key: string, value: T): boolean => {
  const target = storage();
  if (!target) {
    return false;
  }

  try {
    target.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

export const getStoredTemplates = (): WorldCupTemplate[] => readArray(TEMPLATE_KEY, isWorldCupTemplate);

export const saveTemplate = (template: WorldCupTemplate): boolean => {
  const templates = getStoredTemplates().filter((item) => item.id !== template.id);
  return writeJson(TEMPLATE_KEY, [template, ...templates]);
};

export const getStoredResults = (): WorldCupResult[] => readArray(RESULT_KEY, isWorldCupResult);

export const saveResult = (result: WorldCupResult): boolean => {
  const results = getStoredResults().filter((item) => item.id !== result.id);
  return writeJson(RESULT_KEY, [result, ...results]);
};

export const getResultById = (id: string): WorldCupResult | undefined =>
  getStoredResults().find((result) => result.id === id);

export const resetWorldCupStorage = (): void => {
  removeKey(TEMPLATE_KEY);
  removeKey(RESULT_KEY);
};
