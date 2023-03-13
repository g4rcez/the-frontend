import React, { forwardRef, Fragment, useMemo, useRef } from "react";
import { FixedSizeList as List } from "react-window";
import { useScroll } from "@use-gesture/react";

const PADDING_SIZE = 10;
const ITEM_SIZE = 35;

const outerElementType = forwardRef(({ onScroll, children }: any, ref) => {
  const containerRef = useRef<HTMLElement>(null);
  useScroll(
    () => {
      if (!(onScroll instanceof Function)) {
        return;
      }
      const { clientWidth, clientHeight, scrollLeft, scrollTop, scrollHeight, scrollWidth } = document.documentElement;
      onScroll({
        currentTarget: {
          clientHeight,
          clientWidth,
          scrollLeft,
          scrollTop: scrollTop - (containerRef.current ? containerRef.current.getBoundingClientRect().top + scrollTop : 0),
          scrollHeight,
          scrollWidth,
        },
      });
    },
    { target: window }
  );
  // @ts-ignore
  if (ref?.current === null) ref.current = document.documentElement;
  return (
    <tbody className="relative" ref={containerRef as any}>
      {children}
    </tbody>
  );
});

type TRProps<T extends unknown> = Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>, "children"> & {
  Render?: (props: { value: T }) => React.ReactNode | any;
};

type TheadTitle = React.ReactElement | React.ReactNode | string;

type ColProps = TRProps<any> & {
  thead: TheadTitle;
};

export const createColumns = <T extends {}>(add: (add: <K extends keyof T>(id: K, thead: TheadTitle, props?: TRProps<T[K]>) => void) => void) => {
  const items: ColProps[] = [];
  add((id, thead, options) => {
    items.push({ ...options, thead, id: id as any });
  });
  return items;
};

type Props<T extends any[]> = React.DetailedHTMLProps<React.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement> & {
  id: string;
  rows: T;
  cols: ColProps[];
};

type RowProps = {
  index: number;
  style: any;
};

const DefaultRender = (props: any) => <Fragment>{props.value || "---"}</Fragment>;

const Row =
  <T extends any>(id: string, data: T[], cols: ColProps[]) =>
  ({ index, style }: RowProps) => {
    return (
      <tr
        style={{
          ...style,
          top: `${style.top + PADDING_SIZE}px`,
          display: "grid",
          gridTemplateColumns: `repeat(${cols.length}, minmax(0, 1fr))`,
        }}
      >
        {cols.map((col) => {
          const Render = col.Render! || DefaultRender;
          const row = data[index];
          const value = row[col.id as keyof T];
          return (
            <td key={`table-row-col-${index}-${id}-${col.id}`}>
              <Render value={value} />
            </td>
          );
        })}
      </tr>
    );
  };

export const Table = <T extends any[]>({ className = "", cols, rows, ...props }: Props<T>) => {
  const TR = useMemo(() => Row(props.id, rows, cols), [cols]);
  return (
    <table {...props} className={`w-full border-collapse border-2 border-zinc-400 ${className}`}>
      <thead>
        <tr style={{ display: "grid", gridTemplateColumns: `repeat(${cols.length}, minmax(0, 1fr))` }}>
          {cols.map((x) => {
            return <td key={`thead-${props.id}-${x.id}`}>{x.thead}</td>;
          })}
        </tr>
      </thead>
      <List
        height={window.innerHeight}
        outerElementType={outerElementType}
        itemCount={rows.length}
        innerElementType="tbody"
        itemSize={ITEM_SIZE}
        width={window.innerWidth}
        useIsScrolling={false}
        layout="vertical"
      >
        {TR}
      </List>
    </table>
  );
};
