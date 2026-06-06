import { useEffect } from "react";
import {
  containScale,
  designPxToRoundedScreenPx,
  rootFontSizePx,
} from "./designTokens";

function applyRootScale(): void {
  const scale = containScale(window.innerWidth, window.innerHeight);
  const root = document.documentElement;

  root.style.fontSize = `${rootFontSizePx(scale)}px`;
  root.style.setProperty(
    "--hairline-3px",
    `${designPxToRoundedScreenPx(3, scale)}px`,
  );
}

export function useDesignScale(): void {
  useEffect(() => {
    applyRootScale();

    let frame = 0;
    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(applyRootScale);
    };

    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
    };
  }, []);
}
