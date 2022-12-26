import { QueryClient } from "@tanstack/react-query";

export const client = new QueryClient();

export const fetcher = <T,>(request: RequestInfo | URL, init?: RequestInit): Promise<T> =>
  fetch(request, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  }).then((x) => x.json() as T);
