import { AnimatePresence } from "framer-motion";
import { useEffect, useRef, type RefObject } from "react";
import integrationsIcon from "../assets/integrations-icon.png";
import workspaceIcon from "../assets/workspace-icon.png";
import { DockCardPopover } from "./DockCardPopover";
import type { DockCardPayload } from "./NodeDiagram";
import { NodeDiagram } from "./NodeDiagram";
import styles from "./MainCanvas.module.css";

type MainCanvasProps = {
  linkedCard: DockCardPayload | null;
  onLink: (card: DockCardPayload) => void;
  onUnlink: () => void;
  popoverOpen: boolean;
  onPopoverChange: (open: boolean) => void;
  dockContainerRef: RefObject<HTMLDivElement | null>;
};

export function MainCanvas({
  linkedCard,
  onLink,
  onUnlink,
  popoverOpen,
  onPopoverChange,
  dockContainerRef,
}: MainCanvasProps) {
  const integrationsBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!popoverOpen) {
      return;
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onPopoverChange(false);
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (integrationsBtnRef.current?.contains(target)) {
        return;
      }
      if (dockContainerRef.current?.contains(target)) {
        return;
      }
      onPopoverChange(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [popoverOpen, onPopoverChange, dockContainerRef]);

  return (
    <main className={styles.canvas}>
      <header className={styles.topBar}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <button type="button" className={styles.breadcrumbBtn}>
            <img
              src={workspaceIcon}
              alt=""
              className={styles.workspaceIcon}
              width={24}
              height={24}
              draggable={false}
            />
            Workspace
          </button>
          <span className={styles.breadcrumbSep} aria-hidden>
            //
          </span>
          <button type="button" className={styles.breadcrumbBtn}>
            New Integrations
          </button>
        </nav>
        <button
          ref={integrationsBtnRef}
          type="button"
          className={`${styles.integrationsBtn} ${popoverOpen ? styles.integrationsBtnOpen : ""}`}
          aria-expanded={popoverOpen}
          aria-haspopup="dialog"
          onClick={() => onPopoverChange(!popoverOpen)}
        >
          <span className={styles.integrationsBtnContent}>
            <img
              src={integrationsIcon}
              alt=""
              className={styles.integrationsDocIcon}
              width={30}
              height={30}
              draggable={false}
            />
            <span className={styles.integrationsDivider} aria-hidden />
            <span className={styles.integrationsLabel}>Integrations</span>
          </span>
          <AnimatePresence>
            {popoverOpen && (
              <DockCardPopover onClose={() => onPopoverChange(false)} />
            )}
          </AnimatePresence>
        </button>
      </header>

      <NodeDiagram
        linked={linkedCard !== null}
        linkedCard={linkedCard}
        onLink={onLink}
        onUnlink={onUnlink}
      />
    </main>
  );
}
