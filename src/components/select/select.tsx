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

type SelectProps = React.HTMLProps<HTMLInputElement> & {
  options: Option[];
};

export function Select(props: SelectProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const listRef = useRef<Array<HTMLElement | null>>([]);

  const { x, y, strategy, refs, context } = useFloating<HTMLInputElement>({
    whileElementsMounted: autoUpdate,
    open,
    onOpenChange: setOpen,
    middleware: [
      size({
        apply(a) {
          Object.assign(a.elements.floating.style, {
            width: `${a.rects.reference.width}px`,
            maxHeight: `${Math.min(360, a.availableHeight)}px`,
          });
        },
        padding: 10,
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
      activeIndex,
      onNavigate: setActiveIndex,
      virtual: true,
      loop: true,
      allowEscape: true,
      scrollItemIntoView: true,
      focusItemOnOpen: "auto",
    }),
  ]);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    if (value) {
      setOpen(true);
      setActiveIndex(0);
    }
  };

  const list = new Fuzzy(props.options, ["value"], { caseSensitive: false }).search(inputValue);

  return (
    <fieldset>
      <input
        {...getReferenceProps({
          ref: refs.setReference,
          onChange,
          value: inputValue,
          placeholder: "Enter fruit",
          "aria-autocomplete": "list",
          onKeyDown(event) {
            if (event.key === "Enter" && activeIndex != null && list[activeIndex]) {
              setInputValue(list[activeIndex].value);
              setActiveIndex(null);
              setOpen(false);
            }
          },
        })}
        autoComplete="off"
        onFocus={() => setOpen(true)}
        className="bg-black text-white border p-1 rounded"
      />
      <FloatingPortal>
        {open && (
          <FloatingFocusManager context={context} initialFocus={-1} visuallyHiddenDismiss>
            <ul
              {...getFloatingProps({
                ref: refs.setFloating,
                style: { position: strategy, left: x ?? 0, top: y ?? 0, ...transitions.styles },
              })}
              className="bg-slate-200 text-zinc-700 overflow-auto origin-[top_center] overflow-y-auto"
            >
              {list.map((item, index) => (
                <Option
                  {...getItemProps({
                    key: item.value,
                    ref(node) {
                      listRef.current[index] = node;
                    },
                    onClick() {
                      setInputValue(item.value);
                      setOpen(false);
                      (refs.reference.current as HTMLElement)?.focus();
                    },
                  })}
                  option={item}
                  active={activeIndex === index}
                />
              ))}
            </ul>
          </FloatingFocusManager>
        )}
      </FloatingPortal>
    </fieldset>
  );
}
