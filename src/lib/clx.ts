import type { F, N, S, U } from "ts-toolbelt";

type Rec = Record<string, string | boolean>;

type ClxValue = string | undefined | null | boolean | Rec;

type Str = string | number | bigint | boolean | null | undefined;

type Stringify<T> = T extends Str ? T : never;

type MapToString<T extends ClxValue[], C extends number = 0> = C extends T["length"]
  ? {}
  : T[C] extends string
  ? { [k in T[C]]: 1 } & MapToString<T, N.Add<C, 1>>
  : T[C] extends Record<infer I, unknown>
  ? {
      [K in I as Stringify<T[C][K]> extends true ? K : never]: Stringify<T[C][K]>;
    } & MapToString<T, N.Add<C, 1>>
  : {};

type Concat<T extends {}> = S.Join<U.ListOf<keyof U.Merge<Omit<T, "">>>, " ">;

export const clx = <T extends F.Narrow<ClxValue[]>>(...classes: T): Concat<MapToString<T>> => {
  let acc = "";
  for (let i = 0; i < classes.length; i++) {
    const el = classes[i];
    if (!el) continue;
    const type = typeof el;
    if (type === "string" || type === "number") acc += " " + el;
    if (type === "object") for (const k in el as any) if ((el as any)[k]) acc += " " + k;
  }
  return acc.trim() as any;
};
