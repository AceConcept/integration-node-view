import { motion } from "framer-motion";
import { useState, type DragEvent } from "react";
import emptySlotIcon from "../assets/dock/empty-slot.svg";
import { NODE_ICONS } from "../assets/nodeIcons";
import { IntegrationNode } from "./IntegrationNode";
import integrationNodeStyles from "./IntegrationNode.module.css";
import styles from "./NodeDiagram.module.css";

const DRAG_TYPE = "application/vnd.integration-node.card";

export type DockCardPayload = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  accentColor: string;
  description: string;
  docUrl: string;
};

type NodeDiagramProps = {
  linked: boolean;
  linkedCard: DockCardPayload | null;
  instantLink?: boolean;
  disconnecting?: boolean;
  onLink: (card: DockCardPayload) => void;
  onUnlink: () => void;
  onDisconnectComplete?: () => void;
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
  row3Center: 487, /* vertical center of row 3 — Public API icon center */
  row3Bottom: 550,
  slotTop: 636,
  node3Mid: 275,
} as const;

const X = {
  node1: 90,
  center: 470, /* horizontal center of 940px diagram — aligns with dock */
  node3Left: 407, /* center 470 − half of 126px frame */
  node4Left: 787, /* Public API center 850 − half of 126px frame */
} as const;

/** Lines radiate upward from the empty slot (top-center) */
const PATHS = {
  trunkFromSlot: `M ${X.center} ${Y.slotTop} L ${X.center} ${Y.row2Bottom} L ${X.center} ${Y.row2Top} L ${X.center} ${Y.row1Bottom} L ${X.center} ${Y.row1Center}`,
  branchNode4: `M ${X.center} ${Y.row3Center} L ${X.node4Left} ${Y.row3Center}`,
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

const BRANCH4_DELAY = TRUNK_DURATION * trunkProgressAtY(Y.row3Center);
const BRANCH1_DELAY = TRUNK_DURATION * trunkProgressAtY(Y.node3Mid);

/** Reverse: branches retract as the trunk passes each junction on the way back to the slot. */
const UNLINK_BRANCH1_DELAY =
  TRUNK_DURATION * (1 - trunkProgressAtY(Y.node3Mid));
const UNLINK_BRANCH4_DELAY =
  TRUNK_DURATION * (1 - trunkProgressAtY(Y.row3Center));

const LINK_ANIMATION_DURATION = Math.max(
  TRUNK_DURATION,
  BRANCH4_DELAY + BRANCH_DURATION,
  BRANCH1_DELAY + BRANCH_DURATION,
);

const UNLINK_ANIMATION_DURATION = LINK_ANIMATION_DURATION;

const lineEase = [0.42, 0, 0.2, 1] as const;

export function NodeDiagram({
  linked,
  linkedCard,
  instantLink = false,
  disconnecting = false,
  onLink,
  onUnlink,
  onDisconnectComplete,
}: NodeDiagramProps) {
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
              initial={{ pathLength: instantLink ? 1 : 0 }}
              animate={{ pathLength: disconnecting ? 0 : 1 }}
              transition={
                instantLink && !disconnecting
                  ? { duration: 0 }
                  : { duration: TRUNK_DURATION, ease: lineEase }
              }
              onAnimationComplete={() => {
                if (disconnecting) {
                  onDisconnectComplete?.();
                }
              }}
            />
            <motion.path
              d={PATHS.branchNode4}
              className={styles.lineActive}
              fill="none"
              stroke={ACTIVE_STROKE}
              strokeWidth={LINE_WIDTH}
              initial={{ pathLength: instantLink ? 1 : 0, opacity: instantLink ? 1 : 0 }}
              animate={{
                pathLength: disconnecting ? 0 : 1,
                opacity: disconnecting ? 0 : 1,
              }}
              transition={
                instantLink && !disconnecting
                  ? { duration: 0 }
                  : {
                      delay: disconnecting ? UNLINK_BRANCH4_DELAY : BRANCH4_DELAY,
                      duration: BRANCH_DURATION,
                      ease: lineEase,
                    }
              }
            />
            <motion.path
              d={PATHS.branchNode1}
              className={styles.lineActive}
              fill="none"
              stroke={ACTIVE_STROKE}
              strokeWidth={LINE_WIDTH}
              initial={{ pathLength: instantLink ? 1 : 0, opacity: instantLink ? 1 : 0 }}
              animate={{
                pathLength: disconnecting ? 0 : 1,
                opacity: disconnecting ? 0 : 1,
              }}
              transition={
                instantLink && !disconnecting
                  ? { duration: 0 }
                  : {
                      delay: disconnecting ? UNLINK_BRANCH1_DELAY : BRANCH1_DELAY,
                      duration: BRANCH_DURATION,
                      ease: lineEase,
                    }
              }
            />
          </>
        )}
      </svg>

      <div className={styles.nodeRows}>
        <div className={styles.row}>
          <IntegrationNode
            className={`${styles.diagramNode} ${styles.nodeX90}`}
            icon={NODE_ICONS.upstream}
            title="Staging/Release Upstream"
            subtitle="External repo"
            titleClassName={integrationNodeStyles.titleWrap}
          />
          <IntegrationNode
            className={`${styles.diagramNode} ${styles.nodeX470}`}
            icon={NODE_ICONS.core}
            title="Core"
            subtitle="Internal Monorepo"
          />
        </div>

        <div className={styles.row}>
          <IntegrationNode
            className={`${styles.diagramNode} ${styles.nodeX470}`}
            icon={NODE_ICONS.router}
            title="Integration Router"
            subtitle="Aggregator"
          />
        </div>

        <div className={styles.row}>
          <IntegrationNode
            className={`${styles.diagramNode} ${styles.nodeX850}`}
            icon={NODE_ICONS.api}
            title="Public API"
            subtitle="Webhook Services"
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
            <div
              className={`${styles.slotFrame} ${styles.slotFrameFilled} ${disconnecting ? styles.slotFrameDisconnecting : ""}`}
            >
              <motion.div
                className={styles.slotIconBox}
                initial={instantLink ? false : { opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: instantLink ? 0 : 0.35, ease: "easeOut" }}
              >
                <div className={styles.slotIconBoxInner}>
                  <img
                    src={linkedCard?.icon}
                    alt=""
                    className={styles.slotDockIcon}
                    draggable={false}
                  />
                </div>
                <span
                  className={styles.slotIconAccent}
                  style={{ backgroundColor: linkedCard?.accentColor ?? "#fc6d26" }}
                  aria-hidden
                />
              </motion.div>
              <button
                type="button"
                className={styles.emptySlotBtn}
                onClick={onUnlink}
                aria-disabled={disconnecting}
                aria-label="Empty slot"
              >
                <img
                  src={emptySlotIcon}
                  alt=""
                  className={styles.emptySlotIcon}
                  draggable={false}
                />
              </button>
            </div>
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

export { DRAG_TYPE, LINK_ANIMATION_DURATION, UNLINK_ANIMATION_DURATION };
