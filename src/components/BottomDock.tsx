import { motion } from "framer-motion";
import type { DragEvent } from "react";
import gitlabIcon from "../assets/dock/gitlab.svg";
import plusIcon from "../assets/dock/plus.svg";
import { DRAG_TYPE, type DockCardPayload } from "./NodeDiagram";
import styles from "./BottomDock.module.css";

const CARDS: DockCardPayload[] = [
  {
    id: "gitlab-1",
    title: "Gitlab Project",
    subtitle: "Custom Ark",
    path: "dasdasd //",
  },
  {
    id: "gitlab-2",
    title: "Gitlab Project",
    subtitle: "Custom Ark",
    path: "dasdasd //",
  },
  {
    id: "gitlab-3",
    title: "Gitlab Project",
    subtitle: "Custom Ark",
    path: "dasdasd //",
  },
  {
    id: "gitlab-4",
    title: "Gitlab Project",
    subtitle: "Custom Ark",
    path: "dasdasd //",
  },
  {
    id: "gitlab-5",
    title: "Gitlab Project",
    subtitle: "Custom Ark",
    path: "dasdasd //",
  },
];

type BottomDockProps = {
  disabled?: boolean;
};

export function BottomDock({ disabled }: BottomDockProps) {
  const startDrag = (e: DragEvent<HTMLDivElement>, card: DockCardPayload) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData(DRAG_TYPE, JSON.stringify(card));
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div className={styles.dockWrap}>
      <div className={styles.dockStack}>
        {!disabled && (
          <div className={styles.hint} role="status">
            <span className={styles.hintAccent} aria-hidden />
            <p className={styles.hintBody}>
              Drag an item into the node slot to begin integration.
            </p>
            <span className={styles.hintAccent} aria-hidden />
          </div>
        )}
        <motion.div
          className={styles.dock}
        layout
        initial={{ y: "1rem", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className={styles.dockLead} aria-hidden />
        {CARDS.map((card, i) => (
          <motion.div
            key={card.id}
            className={styles.card}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.05 }}
          >
            <div
              className={styles.cardInner}
              draggable={!disabled}
              onDragStart={(e) => startDrag(e, card)}
            >
              <div className={styles.iconBox}>
                <div className={styles.iconBoxInner}>
                  <img
                    src={gitlabIcon}
                    alt=""
                    className={styles.dockIcon}
                    draggable={false}
                  />
                </div>
                <span className={styles.iconAccent} aria-hidden />
              </div>
              <div className={styles.cardText}>
                <span className={styles.cardTitle}>{card.subtitle}</span>
                <span className={styles.cardPath}>{card.path}</span>
                <span className={styles.cardLabel}>{card.title}</span>
              </div>
            </div>
          </motion.div>
        ))}
        <button type="button" className={styles.addBtn} aria-label="Add integration">
          <img src={plusIcon} alt="" className={styles.addIcon} />
        </button>
        </motion.div>
      </div>
    </div>
  );
}
