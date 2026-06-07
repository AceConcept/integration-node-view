import { useEffect, useRef, useState } from "react";
import { BottomDock } from "./BottomDock";
import { MainCanvas } from "./MainCanvas";
import { DOCK_CARDS } from "../data/dockCards";
import { LINK_ANIMATION_DURATION, type DockCardPayload } from "./NodeDiagram";
import { Sidebar } from "./Sidebar";
import styles from "./Dashboard.module.css";

export function Dashboard() {
  const [linkedCard, setLinkedCard] = useState<DockCardPayload | null>(null);
  const [selectedCard, setSelectedCard] = useState<DockCardPayload>(DOCK_CARDS[0]);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [successPopoverOpen, setSuccessPopoverOpen] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const dockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!linkedCard) {
      setSuccessPopoverOpen(false);
      setDisconnecting(false);
      return;
    }

    setPopoverOpen(false);

    const timer = window.setTimeout(() => {
      setSuccessPopoverOpen(true);
    }, LINK_ANIMATION_DURATION * 1000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [linkedCard]);

  const startDisconnect = () => {
    if (!linkedCard || disconnecting) {
      return;
    }
    setSuccessPopoverOpen(false);
    setDisconnecting(true);
  };

  const handleDisconnectComplete = () => {
    setLinkedCard(null);
    setDisconnecting(false);
  };

  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <MainCanvas
        linkedCard={linkedCard}
        selectedCard={selectedCard}
        onLink={setLinkedCard}
        disconnecting={disconnecting}
        onStartDisconnect={startDisconnect}
        onDisconnectComplete={handleDisconnectComplete}
        popoverOpen={popoverOpen}
        onPopoverChange={setPopoverOpen}
        successPopoverOpen={successPopoverOpen}
        onSuccessPopoverChange={setSuccessPopoverOpen}
        dockContainerRef={dockRef}
      />
      <BottomDock
        disabled={linkedCard !== null || disconnecting}
        containerRef={dockRef}
        onCardClick={(card) => {
          setSelectedCard(card);
          setPopoverOpen(true);
        }}
      />
    </div>
  );
}
