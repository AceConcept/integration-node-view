import { useEffect, useRef, useState } from "react";
import { BottomDock } from "./BottomDock";
import { MainCanvas } from "./MainCanvas";
import { DOCK_CARDS } from "../data/dockCards";
import {
  clearIntegrationPath,
  getLinkedCardFromPath,
  pushIntegrationPath,
} from "../routing/integrationUrl";
import { LINK_ANIMATION_DURATION, type DockCardPayload } from "./NodeDiagram";
import { Sidebar } from "./Sidebar";
import styles from "./Dashboard.module.css";

type HintPhase = "idle" | "loading" | "success" | "disconnecting";

export function Dashboard() {
  const urlLinkedOnLoad = useRef(getLinkedCardFromPath());
  const skipLinkAnimationRef = useRef(urlLinkedOnLoad.current !== null);

  const [linkedCard, setLinkedCard] = useState<DockCardPayload | null>(
    () => urlLinkedOnLoad.current,
  );
  const [selectedCard, setSelectedCard] = useState<DockCardPayload>(
    () => urlLinkedOnLoad.current ?? DOCK_CARDS[0],
  );
  const [hintPhase, setHintPhase] = useState<HintPhase>(() =>
    urlLinkedOnLoad.current ? "success" : "idle",
  );
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [successPopoverOpen, setSuccessPopoverOpen] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const dockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPopState = () => {
      const card = getLinkedCardFromPath();
      setLinkedCard(card);
      setSelectedCard(card ?? DOCK_CARDS[0]);
      setHintPhase(card ? "success" : "idle");
      setPopoverOpen(false);
      setSuccessPopoverOpen(false);
      setDisconnecting(false);
      skipLinkAnimationRef.current = card !== null;
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (!linkedCard) {
      setHintPhase("idle");
      setSuccessPopoverOpen(false);
      setDisconnecting(false);
      return;
    }

    setPopoverOpen(false);

    if (skipLinkAnimationRef.current) {
      skipLinkAnimationRef.current = false;
      setHintPhase("success");
      return;
    }

    setHintPhase("loading");

    const timer = window.setTimeout(() => {
      setHintPhase("success");
      setSuccessPopoverOpen(true);
    }, LINK_ANIMATION_DURATION * 1000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [linkedCard]);

  const handleLink = (card: DockCardPayload) => {
    setLinkedCard(card);
    setSelectedCard(card);
    pushIntegrationPath(card.id);
  };

  const startDisconnect = () => {
    if (!linkedCard || disconnecting) {
      return;
    }
    setSuccessPopoverOpen(false);
    setDisconnecting(true);
    setHintPhase("disconnecting");
  };

  const handleDisconnectComplete = () => {
    setLinkedCard(null);
    setDisconnecting(false);
    clearIntegrationPath();
  };

  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <MainCanvas
        linkedCard={linkedCard}
        selectedCard={selectedCard}
        instantLink={urlLinkedOnLoad.current !== null}
        onLink={handleLink}
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
        hintPhase={hintPhase}
        containerRef={dockRef}
        onCardClick={(card) => {
          setSelectedCard(card);
          setPopoverOpen(true);
        }}
      />
    </div>
  );
}
