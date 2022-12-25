import { Fragment, PropsWithChildren, ReactElement } from "react";
import { useLocation, useParams } from "react-router-dom";

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
  const paths = props.path.split("/").slice(1);
  const Divider = props.Divider ?? "/";
  return (
    <nav className="w-fit items-center justify-start">
      <ul className="flex gap-4">
        {paths.map((path, index) => (
          <Fragment key={`breadcrumb-${path}`}>
            {index > 0 && <li>{Divider}</li>}
            <li>{replaceAlias(path, dict, props.alias)}</li>
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
      <Breadcrumb Divider={">>"} params={params as any} path={useLocation().pathname} alias={alias} />
      {children}
    </Fragment>
  );
}
