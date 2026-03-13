export type PdfReport = {
  fileName: string;
  courseCode: string;
  courseTitle: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
};

export const pdfReports: PdfReport[] = [
  {
    fileName: "Capstone Project Final Paper.pdf",
    courseCode: "MUS1610",
    courseTitle: "Music & Spirituality",
    title: "Capstone Project Report: The Weeknd's Dawn FM",
    excerpt: "A report on The Weeknd's album Dawn FM covering themes, production, and spirituality.",
    date: "2022-12-01",
    tags: ["Report", "Capstone"]
  },
  {
    fileName: "Duolingo Campaign Idea.pdf",
    courseCode: "PUR3622",
    courseTitle: "Social Media Management",
    title: "Duolingo Campaign Proposal",
    excerpt: "A social media campaign proposal for Duolingo during the 2024 Olympics.",
    date: "2024-04-20",
    tags: ["Report", "Campaign"]
  },
  {
    fileName: "Duolingo Research & Audit.pdf",
    courseCode: "PUR3622",
    courseTitle: "Social Media Management",
    title: "Duolingo Research & Audit",
    excerpt: "A research and audit of Duolingo's social media presence.",
    date: "2024-04-10",
    tags: ["Report", "Research", "Audit"]
  },
  {
    fileName: "JettNguyen_FailureAnalysisPaper.pdf",
    courseCode: "ENC3246",
    courseTitle: "Professional Communication for Engineers",
    title: "Therac-25 Failure Analysis Paper",
    excerpt: "Final paper analyzing the Therac-25 radiation therapy machine failure.",
    date: "2024-11-20",
    tags: ["Report", "Failure Analysis"]
  },
  {
    fileName: "JettNguyen_ResearchReport.pdf",
    courseCode: "ENC3246",
    courseTitle: "Professional Communication for Engineers",
    title: "AI-Powered Traffic Systems Research Report",
    excerpt: "Research report proposing AI-powered traffic systems in Gainesville, FL.",
    date: "2024-12-01",
    tags: ["Report", "Research"]
  },
  {
    fileName: "Nguyen_Jett_Final_Paper.pdf",
    courseCode: "GEO2500",
    courseTitle: "Global/Regional Economies",
    title: "The Gap in Artificial Intelligence Adoption and the Core-Periphery Model",
    excerpt: "Final paper on AI adoption and global economic structures.",
    date: "2025-12-05",
    tags: ["Report", "Final Paper"]
  },
  {
    fileName: "Nguyen_Jett_Module_2_Essay.pdf",
    courseCode: "GEO2500",
    courseTitle: "Global/Regional Economies",
    title: "GDP vs. HDI as a Measurement of Economic Development",
    excerpt: "Essay comparing GDP and HDI as metrics of economic development.",
    date: "2025-09-10",
    tags: ["Report", "Essay"]
  },
  {
    fileName: "Nguyen_Jett_Module_4_Essay.pdf",
    courseCode: "GEO2500",
    courseTitle: "Global/Regional Economies",
    title: "The Economy Shaped by Core-Periphery Relationships",
    excerpt: "Essay analyzing core-periphery relationships in global economic development.",
    date: "2025-10-01",
    tags: ["Report", "Essay"]
  },
  {
    fileName: "Nguyen_Jett_Module_6_Essay.pdf",
    courseCode: "GEO2500",
    courseTitle: "Global/Regional Economies",
    title: "Cumulative Causation & the Core-Periphery Relationships",
    excerpt: "Essay explaining cumulative causation and peripheralization.",
    date: "2025-10-22",
    tags: ["Report", "Essay"]
  },
  {
    fileName: "Nguyen_Jett_Module_8_Essay.pdf",
    courseCode: "GEO2500",
    courseTitle: "Global/Regional Economies",
    title: "The Coffee Commodity Chain in the Global Economy",
    excerpt: "Essay on the coffee commodity chain, Guatemala's role, and global trade impact.",
    date: "2025-11-12",
    tags: ["Report", "Essay"]
  },
  {
    fileName: "Splitsy Project Proposal.pdf",
    courseCode: "CEN4721",
    courseTitle: "Human-Computer Interaction",
    title: "Splitsy Project Proposal",
    excerpt: "The project proposal for Splitsy.",
    date: "2025-09-18",
    tags: ["Report", "Proposal", "ACM Format"]
  },
  {
    fileName: "Splitsy Implementation Report.pdf",
    courseCode: "CEN4721",
    courseTitle: "Human-Computer Interaction",
    title: "Splitsy Implementation Report",
    excerpt: "A report outlining the vision for the solution, wireframes, and implementation details.",
    date: "2025-10-29",
    tags: ["Report", "Preliminary", "ACM Format"]
  },
  {
    fileName: "Splitsy Final Report.pdf",
    courseCode: "CEN4721",
    courseTitle: "Human-Computer Interaction",
    title: "Splitsy Final Report",
    excerpt: "A final report detailing the implementation, testing, user requirements, outcomes, and reflections on the project.",
    date: "2025-12-03",
    tags: ["Report", "Final", "ACM Format"]
  }
];