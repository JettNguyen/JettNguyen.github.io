import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { pdfReports } from "@/data/pdf-reports";

const baseUrl = "https://jettnguyen.github.io";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/projects", "/coursework", "/reports", "/presentations", "/resume"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date()
  }));

  const projectRoutes = projects.map((item) => ({
    url: `${baseUrl}/projects/${item.slug}`,
    lastModified: new Date()
  }));

  const reportRoutes = pdfReports.map((report) => ({
    url: `${baseUrl}/reports/${report.fileName}`,
    lastModified: new Date()
  }));

  return [...staticRoutes, ...projectRoutes, ...reportRoutes];
}
