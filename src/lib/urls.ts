import queryString from "query-string";

const options = {
  encode: true,
  strict: true,
  parseNumbers: true,
  parseBooleans: true,
};

const tralingPath = (str: string) => str.replace(/\/\//g, "/");

const qs = {
  parse: <T extends {}>(q: string) => queryString.parse(q, options),
  str: <T extends {}>(o?: T) => (o === undefined ? "" : queryString.stringify(o, options)),
};

type ParseSomething<T> = T extends symbol ? string : T;

type Stringify<Path extends string, O extends { [k: string]: any }> = `?${ParseSomething<keyof O>}=${O[keyof O]}`;

export const Urls = {
  join: (baseURL: string, ...urls: string[]) =>
    tralingPath(urls.reduce((acc, el) => acc.replace(/\/+$/, "") + "/" + el.replace(/^\/+/, ""), baseURL)),

  new: <Path extends `/${string}` | string, QS extends {}>(path: Path, q?: QS): Stringify<Path, QS> => `${path}?${qs.str(q)}` as never,
};
