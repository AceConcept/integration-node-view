import { NAV_ICONS } from "../assets/navIcons";
import styles from "./Sidebar.module.css";

type NavItem = {
  id: string;
  label: string;
  icon: string;
  active?: boolean;
};

const PRIMARY_NAV: NavItem[] = [
  { id: "home", label: "Home", icon: NAV_ICONS.home },
  { id: "updates", label: "Updates", icon: NAV_ICONS.updates },
  { id: "inbox", label: "Inbox", icon: NAV_ICONS.inbox },
];

const WORKSPACE_NAV: NavItem[] = [
  { id: "projects", label: "Projects", icon: NAV_ICONS.projects },
  { id: "team", label: "Team", icon: NAV_ICONS.team },
  {
    id: "integrations",
    label: "Integrations",
    icon: NAV_ICONS.integrations,
    active: true,
  },
  { id: "templates", label: "Templates", icon: NAV_ICONS.templates },
  { id: "applications", label: "Applications", icon: NAV_ICONS.applications },
];

function NavLink({ item }: { item: NavItem }) {
  return (
    <button
      type="button"
      className={`${styles.navItem} ${item.active ? styles.navItemActive : ""}`}
      aria-current={item.active ? "page" : undefined}
    >
      <img
        src={item.icon}
        alt=""
        className={styles.navIcon}
        width={24}
        height={24}
        draggable={false}
      />
      <span>{item.label}</span>
    </button>
  );
}

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.workspace}>
        <span className={styles.workspaceMark}>A</span>
        <div className={styles.workspaceName}>
          <span className={styles.workspaceTitle}>Ark Processing WS…</span>
          <span className={styles.workspaceMembers}>1 member</span>
        </div>
      </div>

      <nav className={styles.nav} aria-label="Main">
        {PRIMARY_NAV.map((item) => (
          <NavLink key={item.id} item={item} />
        ))}

        <div className={styles.navSection}>
          <p className={styles.navSectionTitle}>Janovic Processing Workspace</p>
          {WORKSPACE_NAV.map((item) => (
            <NavLink key={item.id} item={item} />
          ))}
        </div>
      </nav>

      <div className={styles.footer}>
        <button type="button" className={styles.onboarding}>
          Onboarding Checklist 1/3
        </button>
        <button type="button" className={styles.footerButton}>
          Free trial ends in 6 days
        </button>
        <button type="button" className={`${styles.footerButton} ${styles.extension}`}>
          <span className={styles.googleMark}>G</span>
          Chrome Extension
        </button>
      </div>
    </aside>
  );
}
