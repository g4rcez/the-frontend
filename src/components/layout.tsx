import { Fragment, PropsWithChildren, ReactElement } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Urls } from "~/lib/urls";

type Dict<T = string> = Record<string, T>;

type DictFn = Dict<(id: string) => string>;

const has = <T, IS extends keyof T = keyof T>(obj: T, key: keyof T | string): key is IS => Object.prototype.hasOwnProperty.call(obj, key);

const replaceAlias = (value: string, dict: Dict, replacer: DictFn): string => {
  if (has(dict, value)) {
    const id = dict[value];
    if (id === "*") return value;
    return replacer[dict[value]](value);
  }
  return value;
};

const Breadcrumb = (props: { params: Dict; path: string; alias: Dict<(id: string) => string>; Divider?: ReactElement | string }) => {
  const dict = Object.keys(props.params).reduce((acc, param) => ({ ...acc, [props.params[param]]: param }), {});
  const paths = props.path.split("/").slice(1).filter(Boolean);
  const Divider = props.Divider ?? "/";
  return (
    <nav className="w-fit items-center justify-start">
      <ul className="flex gap-4">
        {paths.length > 0 && (
          <Fragment>
            <li>
              <Link className="link:underline link:text-blue-400 transition-colors duration-300" to="/">
                /
              </Link>
            </li>
            <li>{Divider}</li>
          </Fragment>
        )}
        {paths.map((path, index) => (
          <Fragment key={`breadcrumb-${path}`}>
            {index > 0 && <li>{Divider}</li>}
            <li>
              {index === paths.length - 1 ? (
                <span className="text-blue-400 font-extrabold">{replaceAlias(path, dict, props.alias)}</span>
              ) : (
                <Link className="link:underline link:text-blue-400 transition-colors duration-300" to={Urls.join("/", ...paths.slice(0, index + 1))}>
                  {replaceAlias(path, dict, props.alias)}
                </Link>
              )}
            </li>
          </Fragment>
        ))}
      </ul>
    </nav>
  );
};

const alias: DictFn = { id: (t) => "Im_ID: " + t };

export function Layout({ children }: PropsWithChildren) {
  const params = useParams();
  return (
    <Fragment>
      <header className="block w-full bg-slate-800 sticky mb-4">
        <div className="container w-full mx-auto flex items-center gap-x-4 p-4 justify-between">
          <nav>
            <h1 className="text-lg font-extrabold">The Frontend</h1>
          </nav>
          <nav>
            <ul className="inline-flex gap-x-4 justify-end w-full">
              <li>Something</li>
              <li>Not a link</li>
            </ul>
          </nav>
        </div>
      </header>
      <div className="px-4 w-full container mx-auto">
        <Breadcrumb Divider={">>"} params={params as any} path={useLocation().pathname} alias={alias} />
        <main>{children}</main>
      </div>
    </Fragment>
  );
}
