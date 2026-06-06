import integrationsIcon from "../assets/integrations-icon.png";
import workspaceIcon from "../assets/workspace-icon.png";
import type { DockCardPayload } from "./NodeDiagram";
import { NodeDiagram } from "./NodeDiagram";
import styles from "./MainCanvas.module.css";

type MainCanvasProps = {
  linkedCard: DockCardPayload | null;
  onLink: (card: DockCardPayload) => void;
};

export function MainCanvas({ linkedCard, onLink }: MainCanvasProps) {
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
        <button type="button" className={styles.integrationsBtn}>
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
      </header>

      <NodeDiagram
        linked={linkedCard !== null}
        linkedCard={linkedCard}
        onLink={onLink}
      />
    </main>
  );
}
