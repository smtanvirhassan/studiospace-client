import { getTokenFromClient } from "./getTokenFromClient";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function authFetch(url: string, options: RequestInit = {}) {
  const token = await getTokenFromClient();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });
}
