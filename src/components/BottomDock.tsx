import { motion } from "framer-motion";
import { useRef, useState, type DragEvent, type RefObject } from "react";
import { DOCK_CARDS } from "../data/dockCards";
import plusIcon from "../assets/dock/plus.svg";
import { DRAG_TYPE, type DockCardPayload } from "./NodeDiagram";
import styles from "./BottomDock.module.css";

const CARDS = DOCK_CARDS;

type BottomDockProps = {
  disabled?: boolean;
  hintPhase?: "idle" | "loading" | "success" | "disconnecting";
  onCardClick?: (card: DockCardPayload) => void;
  containerRef?: RefObject<HTMLDivElement | null>;
};

const HINT_MESSAGES = {
  idle: "Drag an item into the node slot to begin integration.",
  loading: "Loading...",
  success: "Integration successful",
  disconnecting: "Disconnecting...",
} as const;

export function BottomDock({
  disabled,
  hintPhase = "idle",
  onCardClick,
  containerRef,
}: BottomDockProps) {
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);
  const skipClickRef = useRef(false);

  const endDrag = () => {
    setDraggingCardId(null);
    document.body.classList.remove("dockDragging");
  };

  const handleCardClick = (card: DockCardPayload) => {
    if (skipClickRef.current) {
      skipClickRef.current = false;
      return;
    }
    onCardClick?.(card);
  };

  const startDrag = (e: DragEvent<HTMLDivElement>, card: DockCardPayload) => {
    if (disabled) {
      e.preventDefault();
      return;
    }

    skipClickRef.current = true;

    e.dataTransfer.setData(DRAG_TYPE, JSON.stringify(card));
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.dropEffect = "copy";

    const iconBox = e.currentTarget.querySelector(`.${styles.iconBox}`);
    if (iconBox instanceof HTMLElement) {
      const clone = iconBox.cloneNode(true) as HTMLElement;
      clone.classList.add(styles.dragGhost);
      const { width, height } = iconBox.getBoundingClientRect();
      clone.style.width = `${width}px`;
      clone.style.height = `${height}px`;
      document.body.appendChild(clone);

      e.dataTransfer.setDragImage(clone, width / 2, height / 2);

      e.currentTarget.addEventListener(
        "dragend",
        () => {
          clone.remove();
        },
        { once: true },
      );
    }

    setDraggingCardId(card.id);
    document.body.classList.add("dockDragging");
  };

  const allowDragCursor = (e: DragEvent) => {
    if (e.dataTransfer.types.includes(DRAG_TYPE)) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    }
  };

  return (
    <div ref={containerRef} className={styles.dockWrap} onDragOver={allowDragCursor}>
      <div className={styles.dockStack}>
        <div className={styles.hint} role="status">
          <span className={styles.hintAccent} aria-hidden />
          <p className={styles.hintBody}>{HINT_MESSAGES[hintPhase]}</p>
          <span className={styles.hintAccent} aria-hidden />
        </div>
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
                className={`${styles.cardInner} ${draggingCardId === card.id ? styles.cardInnerDragging : ""}`}
                draggable={!disabled}
                onClick={() => handleCardClick(card)}
                onDragStart={(e) => startDrag(e, card)}
                onDragEnd={endDrag}
              >
                <div className={styles.iconBox}>
                  <div className={styles.iconBoxInner}>
                    <img
                      src={card.icon}
                      alt=""
                      className={styles.dockIcon}
                      draggable={false}
                    />
                  </div>
                  <span
                    className={styles.iconAccent}
                    style={{ backgroundColor: card.accentColor }}
                    aria-hidden
                  />
                </div>
                <div className={styles.cardText}>
                  <span className={styles.cardTitle}>{card.subtitle}</span>
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
