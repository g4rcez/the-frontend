import React, { forwardRef } from "react";
import { useId } from "@floating-ui/react";

export type Option = {
  value: string;
  label?: React.ReactElement;
};

type ItemProps = Omit<React.HTMLProps<HTMLLIElement>, "children"> & {
  selected: boolean;
  active: boolean;
  option: Option;
};

export const Option = forwardRef<HTMLLIElement, ItemProps>(({ selected, active, option, ...rest }, ref) => {
  const id = useId();
  return (
    <li
      ref={ref}
      role="option"
      id={id}
      aria-selected={selected}
      {...rest}
      className={`p-2 cursor-pointer ${selected ? "bg-zinc-400 text-white" : ""} ${active ? "bg-indigo-400 text-white" : ""}`}
    >
      {option.label ?? option.value}
    </li>
  );
});
