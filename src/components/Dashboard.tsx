import { useRef, useState } from "react";
import { BottomDock } from "./BottomDock";
import { MainCanvas } from "./MainCanvas";
import type { DockCardPayload } from "./NodeDiagram";
import { Sidebar } from "./Sidebar";
import styles from "./Dashboard.module.css";

export function Dashboard() {
  const [linkedCard, setLinkedCard] = useState<DockCardPayload | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const dockRef = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <MainCanvas
        linkedCard={linkedCard}
        onLink={setLinkedCard}
        onUnlink={() => setLinkedCard(null)}
        popoverOpen={popoverOpen}
        onPopoverChange={setPopoverOpen}
        dockContainerRef={dockRef}
      />
      <BottomDock
        disabled={linkedCard !== null}
        containerRef={dockRef}
        onCardClick={() => setPopoverOpen(true)}
      />
    </div>
  );
}
