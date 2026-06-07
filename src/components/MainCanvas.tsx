import { AnimatePresence } from "framer-motion";
import { useEffect, useRef, type RefObject } from "react";
import integrationsIcon from "../assets/integrations-icon.png";
import workspaceIcon from "../assets/workspace-icon.png";
import { DockCardPopover } from "./DockCardPopover";
import { IntegrationSuccessPopover } from "./IntegrationSuccessPopover";
import type { DockCardPayload } from "./NodeDiagram";
import { NodeDiagram } from "./NodeDiagram";
import styles from "./MainCanvas.module.css";

type MainCanvasProps = {
  linkedCard: DockCardPayload | null;
  selectedCard: DockCardPayload;
  onLink: (card: DockCardPayload) => void;
  disconnecting: boolean;
  onStartDisconnect: () => void;
  onDisconnectComplete: () => void;
  popoverOpen: boolean;
  onPopoverChange: (open: boolean) => void;
  successPopoverOpen: boolean;
  onSuccessPopoverChange: (open: boolean) => void;
  dockContainerRef: RefObject<HTMLDivElement | null>;
};

export function MainCanvas({
  linkedCard,
  selectedCard,
  onLink,
  disconnecting,
  onStartDisconnect,
  onDisconnectComplete,
  popoverOpen,
  onPopoverChange,
  successPopoverOpen,
  onSuccessPopoverChange,
  dockContainerRef,
}: MainCanvasProps) {
  const integrationsAnchorRef = useRef<HTMLDivElement>(null);
  const anyPopoverOpen = popoverOpen || successPopoverOpen;

  useEffect(() => {
    if (!anyPopoverOpen) {
      return;
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onPopoverChange(false);
        onSuccessPopoverChange(false);
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (integrationsAnchorRef.current?.contains(target)) {
        return;
      }
      if (dockContainerRef.current?.contains(target)) {
        return;
      }
      onPopoverChange(false);
      onSuccessPopoverChange(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [
    anyPopoverOpen,
    onPopoverChange,
    onSuccessPopoverChange,
    dockContainerRef,
  ]);

  const handleIntegrationsClick = () => {
    if (linkedCard) {
      onSuccessPopoverChange(!successPopoverOpen);
      return;
    }
    onPopoverChange(!popoverOpen);
  };

  const handleDisconnect = () => {
    onStartDisconnect();
  };

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
        <div className={styles.integrationsAnchor} ref={integrationsAnchorRef}>
          <button
            type="button"
            className={styles.integrationsBtn}
            aria-expanded={anyPopoverOpen}
            aria-haspopup="dialog"
            onClick={handleIntegrationsClick}
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
          </button>
          <AnimatePresence>
            {successPopoverOpen && linkedCard && (
              <IntegrationSuccessPopover
                card={linkedCard}
                onClose={() => onSuccessPopoverChange(false)}
                onDisconnect={handleDisconnect}
                disconnecting={disconnecting}
              />
            )}
            {!successPopoverOpen && popoverOpen && (
              <DockCardPopover
                card={selectedCard}
                onClose={() => onPopoverChange(false)}
              />
            )}
          </AnimatePresence>
        </div>
      </header>

      <NodeDiagram
        linked={linkedCard !== null}
        linkedCard={linkedCard}
        disconnecting={disconnecting}
        onLink={onLink}
        onUnlink={onStartDisconnect}
        onDisconnectComplete={onDisconnectComplete}
      />
    </main>
  );
}
