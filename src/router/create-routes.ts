import { createBrowserRouter, generatePath, RouteObject } from "react-router-dom";
import { Narrow } from "ts-toolbelt/out/Function/Narrow";

type Route = RouteObject & { name: Readonly<string> };

export namespace Router {
  type ExtractPaths<T extends Narrow<Route[]>> = NonNullable<
    {
      [K in keyof T[number]]: T[number]["path"];
    }["path"]
  >;

  type UrlParams<T extends string> = string extends T
    ? Record<string, string>
    : T extends `${infer _}:${infer Param}/${infer Rest}`
    ? { [k in Param | keyof UrlParams<Rest>]: string }
    : T extends `${infer _}:${infer Param}`
    ? { [k in Param]: string }
    : null;

  export function link<T extends Narrow<Route[]>>(
    _routes: T
  ): <Path extends ExtractPaths<T>, Params extends UrlParams<Path>>(
    ...params: Params extends null ? [path: Path] : [path: Path, params: Params]
  ) => string;

  export function link<T extends Narrow<Route[]>>() {
    return <Path extends ExtractPaths<T>, Params extends UrlParams<Path>>(path: Path, params?: Params) =>
      params === undefined ? path : generatePath(path, params as any);
  }

  export const create = <T extends Route[]>(routes: Narrow<T>) => ({
    link: link(routes),
    config: createBrowserRouter(routes as any),
  });
}
