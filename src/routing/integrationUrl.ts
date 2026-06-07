import { DOCK_CARDS, findDockCardById } from "../data/dockCards";
import type { DockCardPayload } from "../components/NodeDiagram";

const INTEGRATION_PREFIX = "/integration/";

export function getIntegrationPath(cardId: string): string {
  return `${INTEGRATION_PREFIX}${cardId}`;
}

export function getLinkedCardFromPath(
  pathname = window.location.pathname,
): DockCardPayload | null {
  const normalized = pathname.replace(/\/+$/, "");
  if (!normalized.startsWith(INTEGRATION_PREFIX)) {
    return null;
  }

  const cardId = normalized.slice(INTEGRATION_PREFIX.length);
  if (!cardId) {
    return null;
  }

  return findDockCardById(cardId) ?? null;
}

export function pushIntegrationPath(cardId: string): void {
  const nextPath = getIntegrationPath(cardId);
  if (window.location.pathname !== nextPath) {
    window.history.pushState({ integrationId: cardId }, "", nextPath);
  }
}

export function clearIntegrationPath(): void {
  if (window.location.pathname !== "/") {
    window.history.pushState(null, "", "/");
  }
}

export function listIntegrationPaths(): string[] {
  return DOCK_CARDS.map((card) => getIntegrationPath(card.id));
}
