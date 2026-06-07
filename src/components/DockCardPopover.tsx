import { motion } from "framer-motion";
import type { MouseEvent, PointerEvent as ReactPointerEvent } from "react";
import { integrationTitle } from "../data/dockCards";
import { IntegrationDocLink } from "./IntegrationDocLink";
import type { DockCardPayload } from "./NodeDiagram";
import styles from "./DockCardPopover.module.css";

type DockCardPopoverProps = {
  card: DockCardPayload;
  onClose: () => void;
};

function CloseIcon() {
  return (
    <svg className={styles.closeIcon} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        d="M7 7l10 10M17 7L7 17"
      />
    </svg>
  );
}

export function DockCardPopover({ card, onClose }: DockCardPopoverProps) {
  const stopBubble = (e: ReactPointerEvent | MouseEvent) => {
    e.stopPropagation();
  };

  return (
      <motion.div
        className={styles.popover}
        initial={{ opacity: 0, y: -8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.96 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        role="dialog"
        aria-label={`${card.subtitle} integration details`}
        onPointerDown={stopBubble}
        onClick={stopBubble}
      >
        <div className={styles.panel}>
          <button
            type="button"
            className={styles.closeBtn}
            aria-label="Close"
            onClick={onClose}
          >
            <CloseIcon />
          </button>

          <div className={styles.header}>
            <div className={styles.headerBrand}>
              <img src={card.icon} alt="" className={styles.brandIcon} />
              <div className={styles.headerText}>
                <span className={styles.projectName}>{card.subtitle}</span>
                <span className={styles.brandTitle}>{integrationTitle(card)}</span>
              </div>
            </div>
          </div>

          <p className={styles.description}>{card.description}</p>

          <IntegrationDocLink href={card.docUrl} />

          <h3 className={styles.sectionTitle}>Connect</h3>
          <p className={styles.sectionBody}>
            Drag Icon from bottom navigation to confirm and connect.
          </p>

          <button type="button" className={styles.addBtn}>
            Add to List
          </button>
        </div>
      </motion.div>
  );
}
