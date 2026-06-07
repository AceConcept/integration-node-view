import { motion } from "framer-motion";
import { useState, type DragEvent } from "react";
import gitlabIcon from "../assets/dock/gitlab.svg";
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
  onUnlink: () => void;
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
  row3Top: 424, /* top of row 3 — top of node-4 icon frame */
  row3Bottom: 550,
  branchNode4Junction: 381, /* mid-gap between node-3 bottom and node-4 top */
  slotTop: 636,
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
  trunkFromSlot: `M ${X.center} ${Y.slotTop} L ${X.center} ${Y.row2Bottom} L ${X.center} ${Y.row2Top} L ${X.center} ${Y.row1Bottom} L ${X.center} ${Y.row1Center}`,
  branchNode4: `M ${X.center} ${Y.branchNode4Junction} L ${X.node4} ${Y.branchNode4Junction} L ${X.node4} ${Y.row3Top}`,
  branchNode1: `M ${X.node3Left} ${Y.node3Mid} L ${X.node1} ${Y.node3Mid} L ${X.node1} ${Y.row1Bottom}`,
} as const;

const LINE_WIDTH = 10;
const ACTIVE_STROKE = "var(--color-line-active)";

const TRUNK_LENGTH =
  Y.slotTop -
  Y.row1Center; /* total vertical span of trunk polyline */
const TRUNK_DURATION = 4;
const BRANCH_DURATION = 0.45;

/** Progress along trunk (0 = slot, 1 = node-2 center) for a given y. */
function trunkProgressAtY(y: number) {
  return (Y.slotTop - y) / TRUNK_LENGTH;
}

const BRANCH4_DELAY = TRUNK_DURATION * trunkProgressAtY(Y.branchNode4Junction);
const BRANCH1_DELAY = TRUNK_DURATION * trunkProgressAtY(Y.node3Mid);

const lineEase = [0.42, 0, 0.2, 1] as const;

export function NodeDiagram({ linked, onLink, onUnlink }: NodeDiagramProps) {
  const [dragOver, setDragOver] = useState(false);

  const allowDragCursor = (e: DragEvent) => {
    if (e.dataTransfer.types.includes(DRAG_TYPE)) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    }
  };

  const handleDragOver = (e: DragEvent) => {
    if (linked) return;
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
    if (linked) return;
    const raw = e.dataTransfer.getData(DRAG_TYPE);
    if (!raw) return;
    try {
      onLink(JSON.parse(raw) as DockCardPayload);
    } catch {
      /* ignore malformed payload */
    }
  };

  return (
    <div className={styles.diagram} onDragOver={allowDragCursor}>
      <div className={styles.diagramBody}>
        <svg
          className={styles.lines}
          viewBox="0 0 940 762"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
        <path
          d={PATHS.trunkFromSlot}
          className={styles.line}
          fill="none"
          strokeWidth={LINE_WIDTH}
        />
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
        {linked && (
          <>
            <motion.path
              d={PATHS.trunkFromSlot}
              className={styles.lineActive}
              fill="none"
              stroke={ACTIVE_STROKE}
              strokeWidth={LINE_WIDTH}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: TRUNK_DURATION, ease: lineEase }}
            />
            <motion.path
              d={PATHS.branchNode4}
              className={styles.lineActive}
              fill="none"
              stroke={ACTIVE_STROKE}
              strokeWidth={LINE_WIDTH}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                delay: BRANCH4_DELAY,
                duration: BRANCH_DURATION,
                ease: lineEase,
              }}
            />
            <motion.path
              d={PATHS.branchNode1}
              className={styles.lineActive}
              fill="none"
              stroke={ACTIVE_STROKE}
              strokeWidth={LINE_WIDTH}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                delay: BRANCH1_DELAY,
                duration: BRANCH_DURATION,
                ease: lineEase,
              }}
            />
          </>
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
        <div className={`${styles.diagramNode} ${styles.nodeX470}`}>
          {linked ? (
            <button
              type="button"
              className={`${styles.slotFrame} ${styles.slotFrameFilled}`}
              onClick={onUnlink}
              aria-label="Remove integration from slot"
            >
              <motion.div
                className={styles.slotIconBox}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <div className={styles.slotIconBoxInner}>
                  <img
                    src={gitlabIcon}
                    alt=""
                    className={styles.slotDockIcon}
                    draggable={false}
                  />
                </div>
                <span className={styles.slotIconAccent} aria-hidden />
              </motion.div>
            </button>
          ) : (
            <div className={styles.slotFrame} aria-label="Drop integration here">
              <span className={styles.slotPlus}>+</span>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}

export { DRAG_TYPE };
