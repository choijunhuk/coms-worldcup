import type { WorldCupResult, WorldCupTemplate } from "../types/worldcup";

export interface ComsUser {
  studentId: string;
  name: string;
  role?: string;
}

export interface MiniDocumentRequest<TPayload> {
  title: string;
  description: string;
  shared: boolean;
  payload: TPayload;
}

export interface MiniDocument<TPayload> {
  id: number;
  app: "worldcup";
  contentType: "template" | "result";
  contentId: string;
  title: string;
  description?: string | null;
  ownerStudentId: string;
  ownerName?: string | null;
  shared: boolean;
  shareSlug?: string | null;
  shareUrl?: string | null;
  payload: TPayload;
  createdAt: string;
  updatedAt: string;
  sharedAt?: string | null;
}

type WorldCupPayload = WorldCupTemplate | WorldCupResult;

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";
const app = "worldcup";

const apiUrl = (path: string): string => `${API_BASE}${path}`;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const requestJson = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(apiUrl(path), {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      ...options.headers,
    },
  });
  if (!response.ok) {
    throw new Error(`COMS API request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
};

export const getCurrentUser = async (): Promise<ComsUser | null> => {
  const response = await fetch(apiUrl("/api/auth/me"), { credentials: "include" });
  if (!response.ok) {
    return null;
  }
  return response.json() as Promise<ComsUser>;
};

export const toMiniDocumentRequest = (
  value: WorldCupPayload,
  shared: boolean,
): MiniDocumentRequest<WorldCupPayload> => {
  const isResult = "winner" in value;
  return {
    title: isResult ? value.templateTitle : value.title,
    description: isResult ? `우승자: ${value.winner.name}` : value.description,
    shared,
    payload: value,
  };
};

export const saveProfileDocument = async (
  contentType: "template" | "result",
  value: WorldCupPayload,
  shared = false,
): Promise<MiniDocument<WorldCupPayload>> =>
  requestJson<MiniDocument<WorldCupPayload>>(`/api/mini-apps/${app}/profile/${contentType}/${value.id}`, {
    method: "PUT",
    body: JSON.stringify(toMiniDocumentRequest(value, shared)),
  });

export const trySaveProfileDocument = async (
  contentType: "template" | "result",
  value: WorldCupPayload,
): Promise<MiniDocument<WorldCupPayload> | null> => {
  try {
    return await saveProfileDocument(contentType, value);
  } catch {
    return null;
  }
};

export const shareProfileDocument = async (
  contentType: "template" | "result",
  value: WorldCupPayload,
): Promise<MiniDocument<WorldCupPayload>> => {
  await saveProfileDocument(contentType, value);
  return requestJson<MiniDocument<WorldCupPayload>>(`/api/mini-apps/${app}/profile/${contentType}/${value.id}/share`, {
    method: "POST",
  });
};

export const listProfileDocuments = async (): Promise<MiniDocument<WorldCupPayload>[]> =>
  requestJson<MiniDocument<WorldCupPayload>[]>(`/api/mini-apps/${app}/profile`);

export const listSharedDocuments = async (): Promise<MiniDocument<WorldCupPayload>[]> => {
  const response = await fetch(apiUrl(`/api/mini-apps/${app}/shared`), { credentials: "include" });
  if (!response.ok) {
    return [];
  }
  return response.json() as Promise<MiniDocument<WorldCupPayload>[]>;
};

export const getSharedDocument = async (slug: string): Promise<MiniDocument<WorldCupPayload>> => {
  const response = await fetch(apiUrl(`/api/mini-apps/${app}/shared/${slug}`), { credentials: "include" });
  if (!response.ok) {
    throw new Error(`Shared worldcup not found: ${response.status}`);
  }
  return response.json() as Promise<MiniDocument<WorldCupPayload>>;
};

export const uploadMediaFile = async (file: File, title: string): Promise<string> => {
  const form = new FormData();
  form.append("title", title.trim() || file.name);
  form.append("description", "COMS 월드컵 항목 미디어");
  form.append("category", "GENERAL");
  form.append("file", file);
  const response = await fetch(apiUrl("/api/files"), {
    method: "POST",
    credentials: "include",
    body: form,
  });
  const data = (await response.json().catch(() => null)) as unknown;
  if (!response.ok || !isRecord(data) || typeof data.id !== "number") {
    throw new Error("미디어 업로드에 실패했습니다. COMS 로그인 상태를 확인해주세요.");
  }
  return apiUrl(`/api/files/${data.id}/inline`);
};
