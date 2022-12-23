export const fetcher = (url: string) => fetch(url).then((x) => x.json());
