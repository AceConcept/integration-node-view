import type { ReactNode } from "react";
import {
  CANVAS_HEIGHT_REM,
  CANVAS_WIDTH_REM,
} from "../scaling/designTokens";
import styles from "./DesignCanvas.module.css";

type DesignCanvasProps = {
  children: ReactNode;
};

export function DesignCanvas({ children }: DesignCanvasProps) {
  return (
    <div className={styles.shell}>
      <div
        className={styles.artboard}
        style={{
          width: `${CANVAS_WIDTH_REM}rem`,
          height: `${CANVAS_HEIGHT_REM}rem`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
