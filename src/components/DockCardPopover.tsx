import { motion } from "framer-motion";
import gitlabIcon from "../assets/dock/gitlab.svg";
import styles from "./DockCardPopover.module.css";

type DockCardPopoverProps = {
  onClose: () => void;
};

function ExternalLinkIcon() {
  return (
    <svg className={styles.docLinkIcon} viewBox="0 0 16 16" aria-hidden>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.5 3.5H3.75A1.25 1.25 0 0 0 2.5 4.75v7.5A1.25 1.25 0 0 0 3.75 13.5h7.5a1.25 1.25 0 0 0 1.25-1.25V9.5M9 2.5h4.5V7M13.5 2.5 7.5 8.5"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        d="M4 4l8 8M12 4l-8 8"
      />
    </svg>
  );
}

export function DockCardPopover({ onClose }: DockCardPopoverProps) {
  return (
      <motion.div
        className={styles.popover}
        initial={{ opacity: 0, y: -8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.96 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        role="dialog"
        aria-label="Gitlab integration details"
      >
        <div className={styles.panel}>
          <div className={styles.header}>
            <div className={styles.headerBrand}>
              <img src={gitlabIcon} alt="" className={styles.brandIcon} />
              <span className={styles.brandTitle}>Gitlab</span>
            </div>
            <button
              type="button"
              className={styles.closeBtn}
              aria-label="Close"
              onClick={onClose}
            >
              <CloseIcon />
            </button>
          </div>

          <p className={styles.description}>
            Automate software delivery, boost productivity, and secure your
            end-to-end software supply chain with the most comprehensive
            AI-powered DevSecOps platform.
          </p>

          <a
            className={styles.docLink}
            href="https://docs.gitlab.com/"
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLinkIcon />
            View Documentation
          </a>

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
