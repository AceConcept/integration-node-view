import apiIcon from "./nodes/api.png";
import coreIcon from "./nodes/core.png";
import routerIcon from "./nodes/router.png";
import upstreamIcon from "./nodes/upstream.png";

/** Diagram node tile icons — rendered at 3rem (48px) inside the node frame. */
export const NODE_ICONS = {
  upstream: upstreamIcon,
  core: coreIcon,
  router: routerIcon,
  api: apiIcon,
} as const;

export type NodeIconId = keyof typeof NODE_ICONS;
