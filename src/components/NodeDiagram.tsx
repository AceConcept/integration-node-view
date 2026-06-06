import { motion } from "framer-motion";
import { useState, type DragEvent } from "react";
import { IntegrationNode } from "./IntegrationNode";
import styles from "./NodeDiagram.module.css";

const DRAG_TYPE = "application/vnd.integration-node.card";

export type DockCardPayload = {
  id: string;
  title: string;
  subtitle: string;
  path: string;
};

type NodeDiagramProps = {
  linked: boolean;
  linkedCard: DockCardPayload | null;
  onLink: (card: DockCardPayload) => void;
};

/**
 * Connector geometry (px at design scale).
 * Row height 126, row gap 86. Icon anchor = frame center.
 */
const Y = {
  row1Center: 63, /* vertical center of row 1 — icon / white square center */
  row1Bottom: 126,
  row2Top: 212,
  row2Bottom: 338,
  row3Bottom: 550,
  slotTop: 636,
  branchNode4: 593, /* mid-gap between row 3 and slot */
  node3Mid: 275,
} as const;

const X = {
  node1: 90,
  center: 470, /* horizontal center of 940px diagram — aligns with dock */
  node3Left: 407, /* center 470 − half of 126px frame */
  node4: 850,
} as const;

/** Lines radiate upward from the empty slot (top-center) */
const PATHS = {
  trunkFromSlot: `M ${X.center} ${Y.slotTop} L ${X.center} ${Y.branchNode4} L ${X.center} ${Y.row2Bottom} L ${X.center} ${Y.row2Top} L ${X.center} ${Y.row1Bottom} L ${X.center} ${Y.row1Center}`,
  branchNode4: `M ${X.center} ${Y.branchNode4} L ${X.node4} ${Y.branchNode4} L ${X.node4} ${Y.row3Bottom}`,
  branchNode1: `M ${X.node3Left} ${Y.node3Mid} L ${X.node1} ${Y.node3Mid} L ${X.node1} ${Y.row1Bottom}`,
} as const;

const LINE_WIDTH = 10;
const LINE_COLOR = "#bababa";

export function NodeDiagram({ linked, linkedCard, onLink }: NodeDiagramProps) {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e: DragEvent) => {
    if (e.dataTransfer.types.includes(DRAG_TYPE)) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
      setDragOver(true);
    }
  };

  const handleDragLeave = () => setDragOver(false);

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const raw = e.dataTransfer.getData(DRAG_TYPE);
    if (!raw) return;
    try {
      onLink(JSON.parse(raw) as DockCardPayload);
    } catch {
      /* ignore malformed payload */
    }
  };

  return (
    <div className={styles.diagram}>
      <div className={styles.diagramBody}>
        <svg
          className={styles.lines}
          viewBox="0 0 940 762"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
        <path
          d={PATHS.branchNode4}
          className={styles.line}
          fill="none"
          strokeWidth={LINE_WIDTH}
        />
        <path
          d={PATHS.branchNode1}
          className={styles.line}
          fill="none"
          strokeWidth={LINE_WIDTH}
        />
        <motion.path
          d={PATHS.trunkFromSlot}
          className={styles.lineActive}
          fill="none"
          strokeWidth={LINE_WIDTH}
          initial={{ pathLength: 1, opacity: 1 }}
          animate={{
            pathLength: 1,
            stroke: linked ? "var(--color-line-active)" : LINE_COLOR,
            opacity: linked ? 1 : dragOver ? 0.85 : 1,
          }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        />
        {linked && (
          <motion.circle
            cx={X.center}
            cy={Y.slotTop}
            r="5"
            fill="var(--color-line-active)"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          />
        )}
      </svg>

      <div className={styles.nodeRows}>
        <div className={styles.row}>
          <IntegrationNode
            className={`${styles.diagramNode} ${styles.nodeX90}`}
            title="node-1"
            subtitle="Main Codebase"
          />
          <IntegrationNode
            className={`${styles.diagramNode} ${styles.nodeX470}`}
            title="node-2"
            subtitle="Main Codebase"
          />
        </div>

        <div className={styles.row}>
          <IntegrationNode
            className={`${styles.diagramNode} ${styles.nodeX470}`}
            title="node-3"
            subtitle="Main Codebase"
          />
        </div>

        <div className={styles.row}>
          <IntegrationNode
            className={`${styles.diagramNode} ${styles.nodeX850}`}
            title="node-4"
            subtitle="Main Codebase"
          />
        </div>
      </div>

      <div
        className={`${styles.slotRow} ${dragOver && !linked ? styles.slotRowOver : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {linked && linkedCard ? (
          <motion.div
            className={styles.slotAnchor}
            initial={{ opacity: 0, y: "0.5rem" }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <IntegrationNode
              title={linkedCard.title}
              subtitle={linkedCard.subtitle}
              variant="gitlab"
            />
          </motion.div>
        ) : (
          <div className={styles.slotAnchor}>
            <div className={styles.emptySlot} aria-label="Drop integration here">
              <span className={styles.slotPlus}>+</span>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}

export { DRAG_TYPE };
