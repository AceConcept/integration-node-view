import styles from "./IntegrationNode.module.css";

type IntegrationNodeProps = {
  title: string;
  subtitle: string;
  icon: string;
  className?: string;
  titleClassName?: string;
};

export function IntegrationNode({
  title,
  subtitle,
  icon,
  className,
  titleClassName,
}: IntegrationNodeProps) {
  return (
    <div className={[styles.node, className].filter(Boolean).join(" ")}>
      <div className={styles.nodeFrame}>
        <div className={styles.iconBox}>
          <img src={icon} alt="" className={styles.nodeIcon} draggable={false} />
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
