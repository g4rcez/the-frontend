import { useRef, useEffect, useCallback } from "react";
import throttle from "lodash/throttle";

const windowScrollPositionKey = {
  y: "pageYOffset",
  x: "pageXOffset",
} as const;

const documentScrollPositionKey = {
  y: "scrollTop",
  x: "scrollLeft",
} as const;

type WindowScrollPositionKey = keyof typeof windowScrollPositionKey;

const getScrollPosition = (axis: WindowScrollPositionKey) =>
  window[windowScrollPositionKey[axis]] ||
  document.documentElement[documentScrollPositionKey[axis]] ||
  document.body[documentScrollPositionKey[axis]] ||
  0;

export const ScrollWindow = ({ children, throttleTime = 10, isGrid = false }: React.PropsWithChildren<any>) => {
  const ref = useRef<HTMLElement>(null);
  const outerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleWindowScroll = throttle(() => {
      const { offsetTop = 0, offsetLeft = 0 } = outerRef.current || {};
      const scrollTop = getScrollPosition("y") - offsetTop;
      const scrollLeft = getScrollPosition("x") - offsetLeft;
      if (isGrid) ref.current && ref.current.scrollTo({ left: scrollLeft, top: scrollTop });
      if (!isGrid) ref.current && ref.current.scrollTo({ top: scrollTop });
    }, throttleTime);

    window.addEventListener("scroll", handleWindowScroll);
    return () => {
      handleWindowScroll.cancel();
      window.removeEventListener("scroll", handleWindowScroll);
    };
  }, [isGrid]);

  const onScroll = useCallback(
    ({ scrollLeft, scrollTop, scrollOffset, scrollUpdateWasRequested }: any) => {
      if (!scrollUpdateWasRequested) return;
      const top = getScrollPosition("y");
      const left = getScrollPosition("x");
      const { offsetTop = 0, offsetLeft = 0 } = outerRef.current || {};

      scrollOffset += Math.min(top, offsetTop);
      scrollTop += Math.min(top, offsetTop);
      scrollLeft += Math.min(left, offsetLeft);

      if (!isGrid && scrollOffset !== top) window.scrollTo(0, scrollOffset);
      if (isGrid && (scrollTop !== top || scrollLeft !== left)) {
        window.scrollTo(scrollLeft, scrollTop);
      }
    },
    [isGrid]
  );

  return children({
    ref,
    outerRef,
    style: {
      width: isGrid ? "auto" : "100%",
      height: "100%",
      display: "inline-block",
    },
    onScroll,
  });
};
