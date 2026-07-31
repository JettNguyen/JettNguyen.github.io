const fs = require("fs");
const path = require("path");

const repo = path.resolve(__dirname, "..");

function read(relPath) {
  return fs.readFileSync(path.join(repo, relPath), "utf8");
}

function findExportLiteral(source, constName) {
  const marker = `export const ${constName}`;
  const start = source.indexOf(marker);

  if (start === -1) {
    throw new Error(`Could not find export ${constName}`);
  }

  const eq = source.indexOf("=", start);

  if (eq === -1) {
    throw new Error(`Could not find assignment for ${constName}`);
  }

  let index = eq + 1;

  while (index < source.length && /\s/.test(source[index])) {
    index += 1;
  }

  const open = source[index];

  if (open !== "{" && open !== "[") {
    throw new Error(`Export ${constName} is not an object/array literal`);
  }

  const close = open === "{" ? "}" : "]";
  let depth = 0;
  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;
  let inLineComment = false;
  let inBlockComment = false;

  for (let i = index; i < source.length; i += 1) {
    const ch = source[i];
    const next = source[i + 1];
    const prev = source[i - 1];

    if (inLineComment) {
      if (ch === "\n") {
        inLineComment = false;
      }
      continue;
    }

    if (inBlockComment) {
      if (ch === "*" && next === "/") {
        inBlockComment = false;
        i += 1;
      }
      continue;
    }

    if (!inSingle && !inDouble && !inTemplate) {
      if (ch === "/" && next === "/") {
        inLineComment = true;
        i += 1;
        continue;
      }

      if (ch === "/" && next === "*") {
        inBlockComment = true;
        i += 1;
        continue;
      }
    }

    if (inSingle) {
      if (ch === "'" && prev !== "\\") {
        inSingle = false;
      }
      continue;
    }

    if (inDouble) {
      if (ch === '"' && prev !== "\\") {
        inDouble = false;
      }
      continue;
    }

    if (inTemplate) {
      if (ch === "`" && prev !== "\\") {
        inTemplate = false;
      }
      continue;
    }

    if (ch === "'") {
      inSingle = true;
      continue;
    }

    if (ch === '"') {
      inDouble = true;
      continue;
    }

    if (ch === "`") {
      inTemplate = true;
      continue;
    }

    if (ch === open) {
      depth += 1;
    }

    if (ch === close) {
      depth -= 1;

      if (depth === 0) {
        return source.slice(index, i + 1);
      }
    }
  }

  throw new Error(`Unbalanced literal for ${constName}`);
}

function evalLiteral(literal) {
  return Function(`"use strict"; return (${literal});`)();
}

function extractData(relPath, constName, transform) {
  const source = read(relPath);
  const literal = findExportLiteral(source, constName);
  const prepared = transform ? transform(literal) : literal;
  return evalLiteral(prepared);
}

function readDirSafe(relPath) {
  const fullPath = path.join(repo, relPath);

  if (!fs.existsSync(fullPath)) {
    return [];
  }

  return fs
    .readdirSync(fullPath)
    .filter((entry) => entry !== ".DS_Store")
    .sort();
}

const projects = extractData("data/projects.ts", "projects");
const resumeData = extractData("data/resume.ts", "resumeData");
const presentations = extractData("data/presentations.ts", "presentations");
const pdfReports = extractData("data/pdf-reports.ts", "pdfReports");
const coursesByYear = extractData("data/courses.ts", "coursesByYear", (literal) =>
  literal
    .replace(/\breportsHub\b/g, '"/reports"')
    .replace(/\bpresentationsHub\b/g, '"/presentations"')
);
const courseworkGpa = extractData("data/courses.ts", "courseworkGpa");
const socialLinks = extractData("data/social-links.ts", "socialLinks");
const featuredGithubRepoNames = extractData("data/github-selection.ts", "featuredGithubRepoNames");
const omittedGithubRepoNames = extractData("data/github-selection.ts", "omittedGithubRepoNames");
const personalLiveSignals = extractData("data/personal.ts", "personalLiveSignals");
const personalInterestSections = extractData("data/personal.ts", "personalInterestSections", (literal) =>
  literal.replace(/icon:\s*(fa[A-Za-z0-9_]+)/g, 'icon: "$1"')
);

const layoutSource = read("app/layout.tsx");
const homeSource = read("app/page.tsx");

const output = {
  generatedAt: new Date().toISOString(),
  source: {
    repo: "JettNguyen.github.io",
    branch: "main"
  },
  site: {
    metadata: {
      layoutMetadataSource: "app/layout.tsx",
      homeMetadataSource: "app/page.tsx",
      layoutMetadataPreview: layoutSource.match(/export const metadata:[\s\S]*?};/)?.[0] ?? null,
      homeMetadataPreview: homeSource.match(/export const metadata:[\s\S]*?};/)?.[0] ?? null
    }
  },
  content: {
    projects,
    about: {
      personalLiveSignals,
      personalInterestSections
    },
    resume: resumeData,
    coursework: {
      courseworkGpa,
      coursesByYear
    },
    presentations,
    reports: pdfReports,
    links: socialLinks,
    githubSelection: {
      featuredGithubRepoNames,
      omittedGithubRepoNames
    }
  },
  media: {
    assets: readDirSafe("public/assets"),
    reports: readDirSafe("public/reports"),
    presentations: readDirSafe("public/presentations")
  }
};

const outPath = path.join(repo, "data/site-content.json");
fs.writeFileSync(outPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");

console.log(`Wrote ${outPath}`);