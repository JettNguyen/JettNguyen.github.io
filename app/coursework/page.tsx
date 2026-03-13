import type { Metadata } from "next";
import Link from "next/link";
import { coursesByYear, courseworkGpa } from "@/data/courses";
import { SectionReveal } from "@/components/section-reveal";
import { getReportMeta, type ReportMeta } from "@/lib/reports";

export const metadata: Metadata = {
  title: "Coursework",
  description: "College classes with linked artifacts, reports, projects, and presentation materials."
};

function parseGpaValue(gpa: string) {
  const parsed = Number.parseFloat(gpa);
  return Number.isFinite(parsed) ? parsed : null;
}

function computeOverallGpa() {
  const manualOverall = courseworkGpa.overallGpa.trim();
  if (manualOverall) {
    return manualOverall;
  }

  const termValues = coursesByYear
    .flatMap((yearBlock) => yearBlock.semesters)
    .map((semester) => parseGpaValue(semester.termGpa))
    .filter((value): value is number => value !== null);

  if (termValues.length === 0) {
    return "--";
  }

  const average = termValues.reduce((sum, value) => sum + value, 0) / termValues.length;
  return average.toFixed(2);
}

function computeYearGpa(termGpas: string[]) {
  const values = termGpas
    .map((termGpa) => parseGpaValue(termGpa))
    .filter((value): value is number => value !== null);

  if (values.length === 0) {
    return "--";
  }

  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  return average.toFixed(2);
}

function formatGrade(letter: string, symbol: string) {
  const cleanLetter = letter.trim();
  const cleanSymbol = symbol.trim();
  if (!cleanLetter) {
    return "--";
  }

  return `${cleanLetter}${cleanSymbol}`;
}

function normalizeLabel(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ");
}

function resolveReportHref(artifactHref: string | undefined, matchingReport: ReportMeta | undefined) {
  if (matchingReport) {
    return matchingReport.pdfPath;
  }

  if (!artifactHref) {
    return undefined;
  }

  const href = artifactHref.trim();

  if (!href.startsWith("/reports/")) {
    return href;
  }

  if (href.toLowerCase().endsWith(".pdf")) {
    return href;
  }

  return `${href}.pdf`;
}

export default async function CourseworkPage() {
  const overallGpa = computeOverallGpa();
  const reports = await getReportMeta();
  const reportsByCourseCode = reports.reduce<Map<string, ReportMeta[]>>((map, report) => {
    const existing = map.get(report.courseCode);

    if (existing) {
      existing.push(report);
    } else {
      map.set(report.courseCode, [report]);
    }

    return map;
  }, new Map<string, ReportMeta[]>());

  return (
    <section id="coursework-overview" className="py-16 sm:py-20">
      <div className="container-shell rounded-2xl border border-line/60 bg-black/10 p-4 sm:p-6">
        <SectionReveal>
          <h1 className="section-title">Coursework</h1>
          <p className="section-subtitle">Classes grouped by year and semester, with attached work linked to Projects, Presentations, and Reports.</p>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-line bg-black/20 px-3 py-1.5">
            <span className="text-[10px] uppercase tracking-[0.14em] text-muted">Overall GPA</span>
            <span className="text-sm font-semibold text-accent-soft">{overallGpa}</span>
          </div>
        </SectionReveal>

        <div id="coursework-grid" className="mt-8 grid gap-4">
          {coursesByYear.map((yearBlock, yearIndex) => (
            <SectionReveal key={yearBlock.year} variant="item" delay={yearIndex * 0.04}>
              <details className="dropdown-item card group/year">
              <summary className="dropdown-summary -mx-2 cursor-pointer list-none rounded-lg px-2 py-1">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold text-text">{yearBlock.year}</h2>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-line px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-muted">
                      {yearBlock.semesters.length} semester{yearBlock.semesters.length > 1 ? "s" : ""}
                    </span>
                    <span className="rounded-full border border-line px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-muted">
                      Year GPA <span className="text-accent-soft">{computeYearGpa(yearBlock.semesters.map((semester) => semester.termGpa))}</span>
                    </span>
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 20 20"
                      className="dropdown-caret h-4 w-4 text-muted transition-transform duration-200 group-open/year:rotate-180"
                      fill="none"
                    >
                      <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </summary>

              <div className="dropdown-panel mt-4 space-y-3 border-t border-line/70 pt-3">
                {yearBlock.semesters.map((semester) => (
                  <details
                    key={`${yearBlock.year}-${semester.term}`}
                    className="dropdown-item group/semester rounded-xl border border-line/70 bg-black/20 p-3"
                  >
                    <summary className="dropdown-summary -mx-1 cursor-pointer list-none rounded-lg px-1 py-1">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-accent-soft">{semester.term} {yearBlock.year}</h3>

                        <div className="flex items-center gap-2">
                          <span className="rounded-full border border-line px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-muted">
                            GPA <span className="text-accent-soft">{semester.termGpa.trim() ? semester.termGpa : "--"}</span>
                          </span>
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 20 20"
                            className="dropdown-caret h-4 w-4 text-muted transition-transform duration-200 group-open/semester:rotate-180"
                            fill="none"
                          >
                            <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </div>
                    </summary>

                    <div className="dropdown-panel mt-3 space-y-3 border-t border-line/70 pt-3">
                      {semester.classes.map((course) => (
                        <details key={`${yearBlock.year}-${semester.term}-${course.course}`} className="dropdown-item group/class rounded-lg border border-line/70 bg-black/20 px-3 py-3">
                          <summary className="dropdown-summary -mx-1 cursor-pointer list-none rounded-lg px-1 py-1">
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="text-base font-semibold text-text">{course.course}</h4>
                                {course.courseCode ? (
                                  <span className="rounded-full border border-line px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-muted">{course.courseCode}</span>
                                ) : null}
                                <span className="rounded-full border border-line px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-muted">
                                  Grade <span className="text-accent-soft">{formatGrade(course.grade.letter, course.grade.symbol)}</span>
                                </span>
                              </div>
                              <svg
                                aria-hidden="true"
                                viewBox="0 0 20 20"
                                className="dropdown-caret h-4 w-4 text-muted transition-transform duration-200 group-open/class:rotate-180"
                                fill="none"
                              >
                                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </div>
                          </summary>

                          <p className="mt-3 border-t border-line/70 pt-3 text-sm text-muted">{course.theme}</p>

                          <div className="mt-3 space-y-2">
                            {course.artifacts.length === 0 ? (
                              <article className="rounded-lg border border-line/70 bg-black/20 px-3 py-2">
                                <p className="text-[10px] uppercase tracking-[0.14em] text-accent-soft">homework</p>
                                <p className="mt-1 text-sm font-medium text-text">Homework and Exam Based Course</p>
                                <p className="mt-1 text-xs text-muted">This course was primarily homework and exam based, so there are no projects or artifacts to display.</p>
                              </article>
                            ) : null}
                            {course.artifacts.map((artifact) => {
                              const courseReports = course.courseCode ? (reportsByCourseCode.get(course.courseCode) ?? []) : [];
                              const matchingReport = artifact.type === "report"
                                ? courseReports.find((report) => normalizeLabel(report.title) === normalizeLabel(artifact.title))
                                : undefined;
                              const reportHref = artifact.type === "report"
                                ? resolveReportHref(artifact.href, matchingReport)
                                : undefined;

                              return (
                                <article key={`${course.course}-${artifact.title}`} className="rounded-lg border border-line/70 bg-black/20 px-3 py-2">
                                  <p className="text-[10px] uppercase tracking-[0.14em] text-accent-soft">{artifact.type}</p>
                                  <p className="mt-1 text-sm font-medium text-text">{artifact.title}</p>
                                  {artifact.note ? <p className="mt-1 text-xs text-muted">{artifact.note}</p> : null}
                                  {artifact.type === "report" && reportHref ? (
                                    <a
                                      href={encodeURI(reportHref)}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="mt-2 inline-flex text-xs text-accent-soft hover:text-accent"
                                    >
                                      Open {matchingReport?.title ?? artifact.title}
                                    </a>
                                  ) : artifact.href ? (
                                    artifact.href.startsWith("/") ? (
                                      <Link href={artifact.href} className="mt-2 inline-flex text-xs text-accent-soft hover:text-accent">
                                        Open linked work
                                      </Link>
                                    ) : (
                                      <a
                                        href={artifact.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="mt-2 inline-flex text-xs text-accent-soft hover:text-accent"
                                      >
                                        Open artifact
                                      </a>
                                    )
                                  ) : null}
                                </article>
                              );
                            })}
                          </div>
                        </details>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
              </details>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
