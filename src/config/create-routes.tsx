import { createBrowserRouter, generatePath, Outlet, RouteObject, ScrollRestoration, useParams } from "react-router-dom";
import { Narrow } from "ts-toolbelt/out/Function/Narrow";
import React, { ComponentType, FC, Fragment, lazy, PropsWithChildren } from "react";

const LayoutImpl = () => {
  return (
    <Fragment>
      <Outlet />
      <ScrollRestoration />
    </Fragment>
  );
};

export namespace Router {
  export type Params<Key extends string = string> = {
    readonly [key in Key]: string | undefined;
  };

  type LoaderArgs = {
    request: Request;
    params: Params;
    context?: any;
  };

  type Route = Omit<RouteObject, "element"> & { name: Readonly<string>; controller: () => Promise<RouteController<any>> };

  type ExtractPaths<T extends Narrow<Route[]>> = NonNullable<
    {
      [K in T[number]["name"]]: T[number]["path"];
    }["path"]
  >;

  type UrlParams<T extends string> = string extends T
    ? Record<string, string>
    : T extends `${infer _}:${infer Param}/${infer Rest}`
    ? { [k in Param | keyof UrlParams<Rest>]: string }
    : T extends `${infer _}:${infer Param}`
    ? { [k in Param]: string }
    : null;

  const link =
    <T extends Narrow<Route[]>>(_routes: T) =>
    <Path extends ExtractPaths<T>, Params extends UrlParams<Path>>(
      ...[path, params]: Params extends null ? [path: Path] : [path: Path, params: Params]
    ) =>
      params === undefined ? path : generatePath(path, params as any);

  const createHook =
    <T extends Narrow<Route[]>>(_routes: T) =>
    <Path extends ExtractPaths<T>>(_path: Path) =>
      useParams() as UrlParams<Path>;

  export type RouteController<T, LoaderProps extends {} = {}> = ComponentType<T> & {
    loader?: (args: LoaderArgs, props: LoaderProps) => Promise<Response> | Response | Promise<any> | any;
  };

  export const create = <T extends Route[], Props extends {} = {}>(Layout: FC<PropsWithChildren>, NotFound: FC, routes: Narrow<T>, props: Props) => {
    return {
      route: link(routes),
      useRouteParams: createHook(routes),
      config: createBrowserRouter([
        {
          path: "/",
          element: (
            <Layout>
              <LayoutImpl />
            </Layout>
          ),
          children: routes
            .map((X): RouteObject => {
              const Component = lazy(X.controller as any);
              return {
                path: X.path,
                index: X.path === "/",
                element: <Component />,
                loader: async (args) => {
                  let component: { default: RouteController<any> } = (await X.controller()) as any;
                  let loader = component.default.loader;
                  return loader ? loader(args, props) : null;
                },
              };
            })
            .concat({ path: "*", element: <NotFound /> }),
        },
      ]),
    };
  };
}
