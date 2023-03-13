import { signal } from "@preact/signals-react";
import { useEffect, useRef, useState } from "react";

type SetState<T extends unknown> = T | ((newValue: T) => T);

export const createSignal = <T extends unknown>(initial: T): [state: T, setState: (val: SetState<T>) => void, reset: () => void] => {
  const state = signal<T>(initial);
  const setState = (callback: SetState<T>) =>
    typeof callback === "function" ? (state.value = (callback as Function)(state.value)) : (state.value = callback);

  const reset = () => (state.value = initial);
  return [state as T, setState, reset];
};

export const useSignal = <T extends unknown>(initial: T) => {
  const [state] = useState(() => createSignal(initial));
  useEffect(() => {
    return () => {
      const reset = state[2];
      reset();
    };
  }, [initial]);
  return state;
};
