import type { Metadata } from "next";
import { getReportsGroupedByCourse } from "@/lib/reports";
import { formatDate } from "@/lib/utils";
import { coursesByYear } from "@/data/courses";
import { SectionReveal } from "@/components/section-reveal";

export const metadata: Metadata = {
  title: "Reports",
  description: "Writing archive grouped by course, including PDF reports, papers, and essays."
};

export default async function ReportsIndexPage() {
  const courseGroups = await getReportsGroupedByCourse();
  const courseTermByKey = new Map<string, string>();

  for (const yearBlock of coursesByYear) {
    for (const semester of yearBlock.semesters) {
      for (const course of semester.classes) {
        if (!course.courseCode) {
          continue;
        }

        const key = `${course.courseCode}__${course.course}`;

        if (!courseTermByKey.has(key)) {
          courseTermByKey.set(key, `${semester.term} ${yearBlock.year}`);
        }
      }
    }
  }

  return (
    <section id="reports-overview" className="py-16 sm:py-20">
      <div className="container-shell rounded-2xl border border-line/60 bg-black/10 p-4 sm:p-6">
        <SectionReveal>
          <h1 className="section-title">Reports</h1>
          <p className="section-subtitle">Writing pieces by class, from most recent to oldest.</p>
          <p className="section-subtitle" style={{ fontSize: "12px" }}>Note: Most writing pieces are not included due to student honor code.</p>
        </SectionReveal>

        <div id="reports-list" className="mt-8 space-y-6">
          {courseGroups.map((group, index) => {
            const termLabel = courseTermByKey.get(`${group.courseCode}__${group.courseTitle}`);

            return (
            <SectionReveal key={`${group.courseCode}-${group.courseTitle}`} variant="item" delay={index * 0.04}>
            <details className="dropdown-item card group/report">
              <summary className="dropdown-summary -mx-2 cursor-pointer list-none rounded-lg px-2 py-1">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h2 className="text-lg font-semibold text-text">{group.courseTitle}</h2>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-muted">
                      <span>{group.courseCode}</span>
                      {termLabel ? <span className="rounded-full border border-line px-2 py-0.5 text-[10px] text-muted">{termLabel}</span> : null}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-line px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-muted">
                      {group.reports.length} piece{group.reports.length > 1 ? "s" : ""}
                    </span>
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 20 20"
                      className="dropdown-caret h-4 w-4 text-muted transition-transform duration-200 group-open/report:rotate-180"
                      fill="none"
                    >
                      <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </summary>

              <div className="dropdown-panel mt-4 space-y-3 border-t border-line/70 pt-3">
                {group.reports.map((post) => (
                  <article key={post.slug} className="rounded-lg border border-line/70 bg-black/20 p-3">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                      <time dateTime={post.date}>{formatDate(post.date)}</time>
                      <span>·</span>
                      <span>PDF</span>
                    </div>
                    <h3 className="mt-2 text-base font-semibold text-text">
                      <a href={post.pdfPath} target="_blank" rel="noreferrer" className="hover:text-accent-soft">
                        {post.title}
                      </a>
                    </h3>
                    <p className="mt-1 text-sm text-muted">{post.excerpt}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span key={tag} className="rounded-full border border-line px-2 py-1 text-xs text-[#c6c7d2]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </details>
            </SectionReveal>
          );})}

          {courseGroups.length === 0 ? (
            <SectionReveal variant="item">
              <div className="card text-sm text-muted">
              Add PDFs in <span className="text-text">/public/reports</span> and map them in <span className="text-text">data/pdf-reports.ts</span> to display them here.
              </div>
            </SectionReveal>
          ) : null}
          </div>
      </div>
    </section>
  );
}
