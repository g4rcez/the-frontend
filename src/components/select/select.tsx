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
import "./select.css";
import { Option } from "~/components/select/options";
import Fuzzy from "fuzzy-search";

type SelectProps = Omit<React.HTMLProps<HTMLInputElement>, "value"> & {
  options: Option[];
  value?: string;
};

export function Select({ options, ...props }: SelectProps) {
  const [open, setOpen] = useState(false);
  const [shadow, setShadow] = useState("");
  const [index, setIndex] = useState<number | null>(null);
  const [value, setValue] = useState(props.value ?? props.defaultValue ?? "");
  const listRef = useRef<Array<HTMLElement | null>>([]);

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

  const transitions = useTransitionStyles(context, {
    duration: 250,
    initial: { transform: "scaleY(0)", opacity: 0.6 },
    open: { transform: "scaley(1)", opacity: 1 },
    close: { transform: "scaleY(0)", opacity: 0 },
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    useRole(context, { role: "listbox" }),
    useDismiss(context),
    useListNavigation(context, {
      listRef,
      activeIndex: index,
      onNavigate: setIndex,
      virtual: true,
      loop: true,
      allowEscape: true,
      scrollItemIntoView: true,
      focusItemOnOpen: "auto",
    }),
  ]);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setShadow(value);
    if (value) {
      setOpen(true);
      setIndex(0);
    }
    props.onChange?.(event);
  };

  const list = new Fuzzy(options, ["value"], { caseSensitive: false }).search(shadow);

  const onSelect = (val: string) => {
    setOpen(false);
    setValue(val);
    setIndex(null);
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
          onClick(e: React.MouseEvent<HTMLInputElement>) {
            onFocus();
            e.currentTarget.focus();
          },
          onFocus,
          onKeyDown(event) {
            if (event.key === "Enter" && index !== null && list[index]) {
              onSelect(list[index].value);
            }
          },
          ref: refs.setReference,
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
        <FloatingFocusManager returnFocus context={context} initialFocus={-1} visuallyHiddenDismiss>
          <ul
            {...getFloatingProps({
              ref: refs.setFloating,
              style: { position: strategy, left: x ?? 0, top: y ?? 0, ...transitions.styles },
            })}
            className="bg-slate-200 text-zinc-700 overflow-auto origin-[top_center] overflow-y-auto"
          >
            {list.map((item, i) => (
              <Option
                {...getItemProps({
                  key: item.value,
                  ref: (node) => (listRef.current[i] = node),
                  onClick: () => onSelect(item.value),
                })}
                option={item}
                active={value === item.value}
                selected={index === i}
              />
            ))}
          </ul>
        </FloatingFocusManager>
      </FloatingPortal>
    </fieldset>
  );
}
