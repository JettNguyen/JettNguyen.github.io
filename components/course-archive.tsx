import Link from "next/link";
import { coursesByYear } from "@/data/courses";

export function CourseArchive() {
  return (
    <div className="space-y-3">
      {coursesByYear.map((yearBlock) => (
        <details key={yearBlock.year} className="card group">
          <summary className="cursor-pointer list-none">
            <p className="text-base font-semibold text-text">{yearBlock.year}</p>
            <p className="mt-1 text-sm text-muted">{yearBlock.semesters.length} semester blocks</p>
            <p className="mt-2 text-[11px] uppercase tracking-[0.12em] text-accent-soft">Expand artifacts</p>
          </summary>

          <div className="mt-4 space-y-2 border-t border-line/70 pt-3">
            {yearBlock.semesters.map((semester) => (
              <section key={`${yearBlock.year}-${semester.term}`} className="rounded-lg border border-line/70 bg-black/20 px-3 py-2">
                <p className="text-[10px] uppercase tracking-[0.14em] text-accent-soft">{semester.term}</p>
                <div className="mt-2 space-y-2">
                  {semester.classes.map((course) => (
                    <article key={`${yearBlock.year}-${semester.term}-${course.course}`} className="rounded-lg border border-line/70 bg-black/20 px-3 py-2">
                      <p className="text-sm font-medium text-text">{course.course}</p>
                      {course.courseCode ? <p className="text-[10px] uppercase tracking-[0.12em] text-muted">{course.courseCode}</p> : null}
                      <div className="mt-2 space-y-2">
                        {course.artifacts.map((artifact) => (
                          <div key={`${course.course}-${artifact.title}`}>
                            <p className="text-[10px] uppercase tracking-[0.14em] text-accent-soft">{artifact.type}</p>
                            <p className="mt-1 text-sm text-text">{artifact.title}</p>
                            {artifact.note ? <p className="mt-1 text-xs text-muted">{artifact.note}</p> : null}
                            {artifact.href ? (
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
                          </div>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}
