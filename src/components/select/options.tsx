import React, { forwardRef } from "react";
import { useId } from "@floating-ui/react";

export type Option = {
  value: string;
  children?: React.ReactElement;
};

type ItemProps = Omit<React.HTMLProps<HTMLLIElement>, "children"> & {
  active: boolean;
  option: Option;
};

export const Option = forwardRef<HTMLLIElement, ItemProps>(({ active, option, ...rest }, ref) => {
  const id = useId();
  return (
    <li ref={ref} role="option" id={id} aria-selected={active} {...rest} className={`p-2 cursor-pointer ${active ? "bg-indigo-400" : ""}`}>
      {option.children ?? option.value}
    </li>
  );
});
