import applicationsIcon from "./nav/applications.png";
import homeIcon from "./nav/home.png";
import inboxIcon from "./nav/inbox.png";
import integrationsIcon from "./nav/team.png";
import projectsIcon from "./nav/projects.png";
import teamIcon from "./nav/integrations.png";
import templatesIcon from "./nav/templates.png";
import updatesIcon from "./nav/updates.png";

/** Nav section icons — 24×24px assets, sized via CSS (1.5rem) */
export const NAV_ICONS = {
  home: homeIcon,
  updates: updatesIcon,
  inbox: inboxIcon,
  projects: projectsIcon,
  team: teamIcon,
  integrations: integrationsIcon,
  templates: templatesIcon,
  applications: applicationsIcon,
} as const;

export type NavIconId = keyof typeof NAV_ICONS;
