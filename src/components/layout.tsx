import { PropsWithChildren } from "react";

export function Layout({ children }: PropsWithChildren) {
  return (
    <div>
      <h1>Layout</h1>
      {children}
    </div>
  );
}
