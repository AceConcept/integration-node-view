import component2Icon from "./dock/Component 2.svg";
import component3Icon from "./dock/Component 3.svg";
import component4Icon from "./dock/Component 4.svg";
import component5Icon from "./dock/Component 5.svg";
import gitlabIcon from "./dock/gitlab.svg";

/** Dock card tile icons — rendered at 3.5rem (56px) in the dock. */
export const DOCK_ICONS = {
  gitlab: gitlabIcon,
  component2: component2Icon,
  component3: component3Icon,
  component4: component4Icon,
  component5: component5Icon,
} as const;

export type DockIconId = keyof typeof DOCK_ICONS;
