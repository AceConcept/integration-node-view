import { GitHubIcon, GitLabIcon } from "./icons";
import styles from "./IntegrationNode.module.css";

type IntegrationNodeProps = {
  title: string;
  subtitle: string;
  variant?: "github" | "gitlab";
  className?: string;
  titleClassName?: string;
};

export function IntegrationNode({
  title,
  subtitle,
  variant = "github",
  className,
  titleClassName,
}: IntegrationNodeProps) {
  return (
    <div className={[styles.node, className].filter(Boolean).join(" ")}>
      <div className={styles.nodeFrame}>
        <div className={styles.iconBox}>
          {variant === "github" ? (
            <GitHubIcon className={styles.githubIcon} />
          ) : (
            <GitLabIcon className={styles.gitlabIcon} />
          )}
        </div>
      </div>
      <div className={styles.labels}>
        <span className={[styles.title, titleClassName].filter(Boolean).join(" ")}>
          {title}
        </span>
        <span className={styles.subtitle}>{subtitle}</span>
      </div>
    </div>
  );
}
