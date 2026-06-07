import styles from "./IntegrationDocLink.module.css";

type IntegrationDocLinkProps = {
  href: string;
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

export function IntegrationDocLink({ href }: IntegrationDocLinkProps) {
  return (
    <a
      className={styles.docLink}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
    >
      <ExternalLinkIcon />
      View Documentation
    </a>
  );
}
