import { createBrowserRouter, generatePath, Outlet, RouteObject, ScrollRestoration, useParams } from "react-router-dom";
import { Narrow } from "ts-toolbelt/out/Function/Narrow";
import React, { ComponentType, FC, Fragment, lazy, PropsWithChildren } from "react";
import { Is } from "~/lib/is";
import { Urls } from "~/lib/urls";

export namespace App {
  type Param = Record<string, string>;

  type FetchArgs<Params extends Param | null = {}> = { request: Request; params: Params; context?: any };

  type UrlParams<T extends string> = string extends T
    ? Record<string, string>
    : T extends `${infer _}:${infer Param}/${infer Rest}`
    ? { [k in Param | keyof UrlParams<Rest>]: string }
    : T extends `${infer _}:${infer Param}`
    ? { [k in Param]: string }
    : null;

  export type Component<T extends {} = {}, Route extends string | {} = {}, LoaderProps extends {} = {}> = ComponentType & {
    loader?: <T extends Param>(args: FetchArgs<Route extends string ? UrlParams<Route> : any>, props: LoaderProps) => Promise<Response | any>;
    action?: <T extends Param>(args: FetchArgs<Route extends string ? UrlParams<Route> : any>, props: LoaderProps) => Promise<Response | any>;
    error?: FC;
  };

  type Route = {
    name: Readonly<string>;
    path: Readonly<string>;
    controller: () => Promise<{ readonly default: Component<any> }>;
  };

  type ExtractPaths<T extends Narrow<Route[]>> = NonNullable<{ [K in keyof T[number]]: T[number]["path"] }["path"]>;

  type QueryString = Record<string, string | null | undefined | number>;

  const logic =
    <T extends Narrow<Route[]>, Fn extends (c: { qs?: QueryString; params?: object; path: ExtractPaths<T> }) => Response | string>(
      _routes: T,
      fn: Fn
    ) =>
    <
      Path extends ExtractPaths<T>,
      QS extends UrlParams<Path> extends null ? QueryString : UrlParams<Path>,
      Params extends UrlParams<Path> extends null ? undefined : UrlParams<Path>
    >(
      ...a: Params extends undefined ? [path: Path, qs?: QS] : [path: Path, params: Params, qs?: QueryString]
    ): ReturnType<Fn> =>
      a[0].includes("/:")
        ? (fn({ path: a[0], qs: a[2], params: a[1] as any }) as any)
        : (fn({
            path: a[0],
            qs: a[1] as any,
          }) as any);

  const createHook =
    <T extends Narrow<Route[]>>(_routes: T) =>
    <Path extends ExtractPaths<T>>(_path: Path) =>
      useParams() as UrlParams<Path>;

  const createRouteFunction =
    <Args extends FetchArgs, Props extends {}>(type: "loader" | "action", route: Narrow<Route>, props: Props) =>
    async (args: Args) => {
      const component: { default: Component<any, string> } = await route.controller();
      const fn = component.default[type];
      return fn ? fn(args, props) : null;
    };

  type Methods = "get" | "post" | "patch" | "put" | "delete";

  type ActionByMethod<Args extends FetchArgs, Props extends {}> = (args: Args, props: Props) => Promise<Response | any>;

  export const create = <T extends Route[], Props extends {} = {}>(routes: Narrow<T>, props: Props, Layout: FC<PropsWithChildren>, NotFound: FC) => ({
    routes,
    link: logic(routes, ({ params, path, qs }) => {
      const url = params === undefined ? path : generatePath(path as string, params as never);
      return Urls.new(url as string, qs);
    }),
    redirect: logic(routes, ({ qs, params, path }) => {
      const url = params === undefined ? path : generatePath(path as string, params);
      const location = Urls.new(url as string, qs);
      return new Response("", { status: 302, headers: { Location: location } });
    }),
    useRouteParams: createHook(routes),
    actions:
      <Args extends FetchArgs>(methods: Partial<Record<Methods, ActionByMethod<Args, Props>>>) =>
      async (args: Args) => {
        const method = args.request.method.toLowerCase();
        if (Is.keyof(method, methods)) return methods[method]?.(args, props);
        return null;
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
            const Error = lazy(() =>
              route.controller().then((x) => {
                const E = x.default.error ?? Fragment;
                return {
                  default: () => (
                    <Fragment>
                      <E />
                    </Fragment>
                  ),
                };
              })
            );
            return {
              id: route.name,
              path: route.path,
              element: <Component />,
              errorElement: <Error />,
              action: createRouteFunction("action", route, props),
              loader: createRouteFunction("loader", route, props),
            };
          })
          .concat({ path: "*", element: <NotFound /> }),
      },
    ]),
  });
}
