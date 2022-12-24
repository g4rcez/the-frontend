import { createBrowserRouter, generatePath, Outlet, redirect, RouteObject, ScrollRestoration, useParams } from "react-router-dom";
import { Narrow } from "ts-toolbelt/out/Function/Narrow";
import React, { ComponentType, FC, Fragment, lazy, PropsWithChildren } from "react";

export namespace Router {
  export type QueryString<Key extends {} = {}> = {
    readonly [key in keyof Key]: string | undefined;
  };

  export type FetchArgs = { request: Request; params: QueryString<Record<string, string>>; context?: any };

  type UrlParams<T extends string> = string extends T
    ? Record<string, string>
    : T extends `${infer _}:${infer Param}/${infer Rest}`
    ? { [k in Param | keyof UrlParams<Rest>]: string }
    : T extends `${infer _}:${infer Param}`
    ? { [k in Param]: string }
    : null;

  export type Component<T, LoaderProps extends {} = {}> = ComponentType & {
    loader?: (args: FetchArgs, props: LoaderProps) => Promise<Response | any>;
    action?: (args: FetchArgs, props: LoaderProps) => Promise<Response | any>;
  };

  type Route = Omit<RouteObject, "element"> & {
    name: Readonly<string>;
    controller: () => Promise<{ readonly default: Component<any> }>;
  };

  type ExtractPaths<T extends Narrow<Route[]>> = NonNullable<{ [K in T[number]["name"]]: T[number]["path"] }["path"]>;

  const link =
    <T extends Narrow<Route[]>>(_routes: T) =>
    <Path extends ExtractPaths<T>, Params extends UrlParams<Path>>(
      ...[path, params]: Params extends null ? [path: Path] : [path: Path, params: Params]
    ) =>
      params === undefined ? path : generatePath(path, params as never);

  const createHook =
    <T extends Narrow<Route[]>>(_routes: T) =>
    <Path extends ExtractPaths<T>>(_path: Path) =>
      useParams() as UrlParams<Path>;

  const createRouteFunction =
    <Args extends FetchArgs, Props extends {}>(type: "loader" | "action", route: Narrow<Route>, props: Props) =>
    async (args: Args) => {
      const component: { default: Component<any> } = await route.controller();
      const fn = component.default[type];
      return fn ? fn(args, props) : null;
    };

  export const create = <T extends Route[], Props extends {} = {}>(Layout: FC<PropsWithChildren>, NotFound: FC, routes: Narrow<T>, props: Props) => {
    return {
      link: link(routes),
      useRouteParams: createHook(routes),
      redirect: (path: `/${string}`) => {
        return new Response("", { status: 302, headers: { Location: path } });
      },
      config: createBrowserRouter([
        {
          path: "/",
          element: (
            <Layout>
              <Fragment>
                <Outlet />
                <ScrollRestoration />
              </Fragment>
            </Layout>
          ),
          children: routes
            .map((route): RouteObject => {
              const Component = lazy(route.controller);
              return {
                path: route.path,
                element: <Component />,
                action: createRouteFunction("action", route, props),
                loader: createRouteFunction("loader", route, props),
              };
            })
            .concat({ path: "*", element: <NotFound /> }),
        },
      ]),
    };
  };
}
