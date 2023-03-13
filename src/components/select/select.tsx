import React, { useRef, useState } from "react";
import {
  autoUpdate,
  FloatingFocusManager,
  FloatingPortal,
  size,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
  useTransitionStyles,
} from "@floating-ui/react";
import { Option } from "~/components/select/options";
import Fuzzy from "fuzzy-search";
import { usePrevious } from "~/hooks/use-previous";

type SelectProps = Omit<React.HTMLProps<HTMLInputElement>, "value"> & {
  options: Option[];
  value?: string;
};

const transitionStyles = {
  duration: 250,
  initial: { transform: "scaleY(0)", opacity: 0.2 },
  open: { transform: "scaleY(1)", opacity: 1 },
  close: { transform: "scaleY(0)", opacity: 0 },
} as const;

const fuzzyOptions = { caseSensitive: false, sort: false };

const emptyRef: any[] = [];

export function Select({ options, ...props }: SelectProps) {
  const [open, setOpen] = useState(false);
  const [shadow, setShadow] = useState("");
  const [value, setValue] = useState(props.value ?? props.defaultValue ?? "");
  const [index, setIndex] = useState<number | null>(null);
  const listRef = useRef<Array<HTMLElement | null>>(emptyRef);
  const previousIndex = usePrevious(index);

  const list = new Fuzzy(options, ["value"], fuzzyOptions).search(shadow);

  const { x, y, strategy, refs, context } = useFloating<HTMLInputElement>({
    whileElementsMounted: autoUpdate,
    open,
    onOpenChange: setOpen,
    middleware: [
      size({
        padding: 10,
        apply(a) {
          Object.assign(a.elements.floating.style, {
            width: `${a.rects.reference.width}px`,
            maxHeight: `${Math.min(360, a.availableHeight)}px`,
          });
        },
      }),
    ],
  });

  const transitions = useTransitionStyles(context, transitionStyles);

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    useRole(context, { role: "listbox" }),
    useDismiss(context),
    useListNavigation(context, {
      activeIndex: index,
      allowEscape: true,
      focusItemOnOpen: "auto",
      listRef,
      loop: true,
      openOnArrowKeyDown: true,
      scrollItemIntoView: true,
      selectedIndex: index,
      virtual: true,
      onNavigate: (n) => {
        const lastIndex = list.length - 1;
        if (n === null && previousIndex === 0) return setIndex(lastIndex);
        if (n === null && previousIndex === lastIndex) return setIndex(0);
        const i = n ?? previousIndex ?? null;
        return i === null ? undefined : setIndex(i);
      },
    }),
  ]);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setShadow(value);
    if (!open && value === "") return setOpen(true);
    return value ? setOpen(true) : props.onChange?.(event);
  };

  const onSelect = (val: string) => {
    setValue(val);
    setOpen(false);
    setShadow("");
  };

  const onFocus = () => {
    setOpen(true);
    setShadow("");
  };

  return (
    <fieldset className="relative w-auto">
      <input
        {...getReferenceProps({
          ...props,
          onChange,
          onFocus,
          ref: refs.setReference,
          onClick: (e: React.MouseEvent<HTMLInputElement>) => e.currentTarget.focus(),
          onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
            if (event.key === "Escape") {
              event.currentTarget.blur();
              return setOpen(false);
            }
            if (event.key === "Enter") {
              if (index !== null && list[index]) return onSelect(list[index].value);
              if (list.length === 1) return onSelect(list[0].value);
            }
          },
        })}
        value={open ? shadow : value}
        aria-autocomplete="list"
        autoComplete="off"
        className={`bg-black text-white border p-2 rounded px-4 ${props.className ?? ""}`}
      />
      <div className="absolute top-2.5 right-3 p-0">
        {value && (
          <button
            className="link:text-red-400 transition-colors duration-300"
            onClick={() => {
              setShadow("");
              setValue("");
              setOpen(false);
            }}
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        )}
      </div>
      <FloatingPortal preserveTabOrder>
        <FloatingFocusManager closeOnFocusOut guards returnFocus context={context} initialFocus={-1} visuallyHiddenDismiss>
          <ul
            {...getFloatingProps({
              ref: refs.setFloating,
              style: { position: strategy, left: x ?? 0, top: y ?? 0, ...transitions.styles },
            })}
            className="bg-zinc-800 text-zinc-200 list-none p-0 m-0 rounded-b-lg shadow-2xl overflow-auto origin-[top_center] overflow-y-auto"
          >
            {list.map((item, i) => (
              <Option
                {...getItemProps({
                  key: `${item.value}-option`,
                  onClick: () => onSelect(item.value),
                  ref: (node) => (listRef.current[i] = node),
                })}
                option={item}
                selected={index === i}
                active={value === item.value}
              />
            ))}
          </ul>
        </FloatingFocusManager>
      </FloatingPortal>
    </fieldset>
  );
}
