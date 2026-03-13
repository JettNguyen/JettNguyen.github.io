import { pdfReports } from "@/data/pdf-reports";

export type ReportMeta = {
  slug: string;
  courseCode: string;
  courseTitle: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  pdfPath: string;
};

export type CourseReportGroup = {
  courseCode: string;
  courseTitle: string;
  reports: ReportMeta[];
};

function getSlugFromFileName(fileName: string) {
  return fileName.replace(/\.pdf$/i, "");
}

function getPdfPath(fileName: string) {
  return `/reports/${fileName}`;
}

function getDateValue(date: string) {
  const dateOnlyMatch = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (dateOnlyMatch) {
    const year = Number.parseInt(dateOnlyMatch[1], 10);
    const month = Number.parseInt(dateOnlyMatch[2], 10);
    const day = Number.parseInt(dateOnlyMatch[3], 10);
    return new Date(year, month - 1, day).valueOf();
  }

  return new Date(date).valueOf();
}

export async function getReportMeta(): Promise<ReportMeta[]> {
  const allReports = pdfReports.map((report) => ({
    slug: getSlugFromFileName(report.fileName),
    courseCode: report.courseCode,
    courseTitle: report.courseTitle,
    title: report.title,
    excerpt: report.excerpt,
    date: report.date,
    tags: report.tags,
    pdfPath: getPdfPath(report.fileName)
  }));

  return allReports.sort((a, b) => getDateValue(b.date) - getDateValue(a.date));
}

export async function getReportsGroupedByCourse(): Promise<CourseReportGroup[]> {
  const reports = await getReportMeta();
  const map = new Map<string, CourseReportGroup>();

  for (const report of reports) {
    const key = `${report.courseCode}__${report.courseTitle}`;
    const existing = map.get(key);

    if (existing) {
      existing.reports.push(report);
    } else {
      map.set(key, {
        courseCode: report.courseCode,
        courseTitle: report.courseTitle,
        reports: [report]
      });
    }
  }

  const groups = Array.from(map.values()).map((group) => ({
    ...group,
    reports: group.reports.sort((a, b) => getDateValue(b.date) - getDateValue(a.date))
  }));

  return groups.sort((a, b) => getDateValue(b.reports[0].date) - getDateValue(a.reports[0].date));
}