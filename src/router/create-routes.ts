import { createBrowserRouter, generatePath, RouteObject, useParams } from "react-router-dom";
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

  export function link<T extends Narrow<Route[]>>(_routes: T) {
    return <Path extends ExtractPaths<T>, Params extends UrlParams<Path>>(
      ...[path, params]: Params extends null ? [path: Path] : [path: Path, params: Params]
    ) => (params === undefined ? path : generatePath(path, params as any));
  }

  export const createHook = <T extends Narrow<Route[]>>(_routes: T) => {
    return function useRouteParams<Path extends ExtractPaths<T>>(_path: Path) {
      const params = useParams();
      return params as UrlParams<Path>;
    };
  };

  export const create = <T extends Route[]>(routes: Narrow<T>) => ({
    link: link(routes),
    useRouteParams: createHook(routes),
    config: createBrowserRouter(routes as any),
  });
}
