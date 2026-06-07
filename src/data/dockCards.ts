import { DOCK_ICONS } from "../assets/dockIcons";
import type { DockCardPayload } from "../components/NodeDiagram";

export const DOCK_CARDS: DockCardPayload[] = [
  {
    id: "gitlab-1",
    title: "Gitlab Project",
    subtitle: "Custom Ark",
    icon: DOCK_ICONS.gitlab,
    accentColor: "#fc6d26",
    description:
      "Automate software delivery, boost productivity, and secure your end-to-end software supply chain with the most comprehensive AI-powered DevSecOps platform.",
    docUrl: "https://docs.gitlab.com/",
  },
  {
    id: "python-1",
    title: "Python Project",
    subtitle: "Data Pipeline",
    icon: DOCK_ICONS.component2,
    accentColor: "#ffd43b",
    description:
      "Run Python scripts and data pipelines from your integration hub. Automate ETL workflows, schedule jobs, and connect analytics tools to your codebase.",
    docUrl: "https://docs.python.org/3/",
  },
  {
    id: "dotnet-1",
    title: ".NET Core",
    subtitle: "API Gateway",
    icon: DOCK_ICONS.component3,
    accentColor: "#512bd4",
    description:
      "Deploy and manage .NET Core services through a unified API gateway. Handle routing, authentication, and microservice orchestration from one integration point.",
    docUrl: "https://learn.microsoft.com/en-us/dotnet/core/",
  },
  {
    id: "springboot-1",
    title: "Spring Boot",
    subtitle: "Build Engine",
    icon: DOCK_ICONS.component4,
    accentColor: "#6db33f",
    description:
      "Power your build engine with Spring Boot microservices. Compile, test, and deploy Java applications with integrated CI pipeline tooling.",
    docUrl: "https://docs.spring.io/spring-boot/docs/current/reference/html/",
  },
  {
    id: "apache-1",
    title: "Apache Server",
    subtitle: "Web Gateway",
    icon: DOCK_ICONS.component5,
    accentColor: "#2584ff",
    description:
      "Route traffic and serve applications through Apache. Configure virtual hosts, reverse proxy rules, and web gateway policies from your workspace.",
    docUrl: "https://httpd.apache.org/docs/",
  },
];

export function integrationTitle(card: DockCardPayload): string {
  return `${card.title} Integration`;
}
