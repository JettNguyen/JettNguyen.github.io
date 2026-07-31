import { Experiment, Perspective } from "@/lib/types";

export function getProjectSummaryByPerspective(project: Experiment, perspective: Perspective) {
  if (perspective === "recruiter") {
    return project.shortSummaryRecruiter ?? project.summary;
  }

  if (perspective === "engineer") {
    return project.shortSummaryEngineer ?? project.summary;
  }

  return project.shortSummaryNonTechnical ?? project.summary;
}

export function getPresentationSummaryByPerspective(description: string, _perspective: Perspective) {
  return description;
}
