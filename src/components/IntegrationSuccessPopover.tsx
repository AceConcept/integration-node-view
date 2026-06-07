import { motion } from "framer-motion";
import { useState, type MouseEvent, type PointerEvent as ReactPointerEvent } from "react";
import { integrationTitle } from "../data/dockCards";
import { IntegrationDocLink } from "./IntegrationDocLink";
import type { DockCardPayload } from "./NodeDiagram";
import styles from "./IntegrationSuccessPopover.module.css";

type IntegrationSuccessPopoverProps = {
  card: DockCardPayload;
  onClose: () => void;
  onDisconnect?: () => void;
  disconnecting?: boolean;
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

function SuccessCheckIcon() {
  return (
    <svg className={styles.successCheck} viewBox="0 0 14 14" aria-hidden>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.5 7.25 5.5 10.25 11.5 3.75"
      />
    </svg>
  );
}

type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
};

function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`${styles.toggle} ${checked ? styles.toggleOn : ""}`}
      onClick={() => onChange(!checked)}
    >
      <span className={styles.toggleKnob} aria-hidden />
    </button>
  );
}

export function IntegrationSuccessPopover({
  card,
  onClose,
  onDisconnect,
  disconnecting = false,
}: IntegrationSuccessPopoverProps) {
  const [metadataAccess, setMetadataAccess] = useState(true);
  const [writeAccess, setWriteAccess] = useState(true);

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
      aria-label={`${card.subtitle} integration connected`}
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

        <div className={styles.successStatus}>
          <span className={styles.successIcon}>
            <SuccessCheckIcon />
          </span>
          <span className={styles.successText}>Integration successful!</span>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Permissions</h3>

          <div className={styles.permissionRow}>
            <span className={styles.permissionLabel}>Read access to metadata</span>
            <Toggle
              checked={metadataAccess}
              onChange={setMetadataAccess}
              label="Read access to metadata"
            />
          </div>

          <div className={styles.permissionRow}>
            <span className={styles.permissionLabel}>
              Read and write access to administration, checks, code, commit
              statuses, deployments, issues, pull requests, and repository hooks
            </span>
            <Toggle
              checked={writeAccess}
              onChange={setWriteAccess}
              label="Read and write access to administration, checks, code, commit statuses, deployments, issues, pull requests, and repository hooks"
            />
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Connect</h3>
          <p className={styles.sectionBody}>
            Drag Icon from bottom navigation to confirm and connect.
          </p>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Suspend your Installation</h3>
          <p className={styles.sectionBody}>
            This will block the app access to your resources.
          </p>
          <button type="button" className={styles.actionBtn}>
            Suspend
          </button>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Disconnect Integration</h3>
          <p className={styles.sectionBody}>
            This will remove the app and revoke access to all resources.
          </p>
          <button
            type="button"
            className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
            onClick={onDisconnect}
            disabled={disconnecting}
          >
            Disconnect
          </button>
        </div>
      </div>
    </motion.div>
  );
}
