export type CourseArtifact = {
    type: "text" | "essay" | "presentation" | "report" | "build" | "project" | "spreadsheet" | "excel" | "homework";
    title: string;
    href?: string;
    note?: string;
};

export type CourseClass = {
    courseCode?: string;
    course: string;
    grade: {
        letter: string;
        symbol: string;
    };
    theme: string;
    artifacts: CourseArtifact[];
};

export type CourseSemester = {
    term: "Spring" | "Summer" | "Fall";
    termGpa: string;
    classes: CourseClass[];
};

export type CourseYear = {
    year: number;
    semesters: CourseSemester[];
};

const reportsHub = "/reports";
const presentationsHub = "/presentations";

export const courseworkGpa = {
    overallGpa: "3.63"
};

export const coursesByYear: CourseYear[] = [
    {
        year: 2026,
        semesters: [
            {
                term: "Spring",
                termGpa: "TBA",
                classes: [
                    {
                        courseCode: "CIS4914",
                        course: "Senior Project",
                        grade: { letter: "TBA", symbol: "" },
                        theme: "Product development: requirements, architecture, and iterative delivery in a team setting.",
                        artifacts: [
                            { type: "project", title: "Sideline", href: "/projects/sideline", note: "MERN stack mobile-first web application for youth soccer match video management." },
                            { type: "presentation", title: "Sideline Presentation 1", href: "/presentations/sideline-1", note: "Problem framing, architecture, high-fidelity wireframes, user flow, and next steps." },
                        ]
                    },
                    {
                        courseCode: "CIS4930",
                        course: "Internet Programming",
                        grade: { letter: "TBA", symbol: "" },
                        theme: "Modern web application design across frontend, backend, authentication, and deployment workflows.",
                        artifacts: [
                            { type: "project", title: "Stackd", href: "/projects/stackd", note: "MERN stack web application for flashcard studying." },
                        ]
                    },
                    {
                        courseCode: "CNT4007",
                        course: "Computer Network Fundamentals",
                        grade: { letter: "TBA", symbol: "" },
                        theme: "Network-layer behavior, reliability, and performance tradeoffs in distributed systems.",
                        artifacts: [
                            { type: "project", title: "P2P File Sharing", href: "/projects/networks-project", note: "In-progress P2P file sharing application with focus on network protocols and data consistency." }
                        ]
                    },
                    {
                        courseCode: "PUR3211",
                        course: "Diverse Voices",
                        grade: { letter: "TBA", symbol: "" },
                        theme: "Audience-centered communication, representation, and message design across different communities.",
                        artifacts: [
                            { type: "presentation", title: "Apple DEI Assessment", href: presentationsHub, note: "In-progress presentation assessing diversity, equity, and inclusion implementation at Apple." }
                        ]
                    }
                ]
            }
        ]
    },
    {
        year: 2025,
        semesters: [
            {
                term: "Fall",
                termGpa: "3.92",
                classes: [
                    {
                        courseCode: "CAP3027",
                        course: "Introduction to Computational Media",
                        grade: { letter: "A", symbol: "-" },
                        theme: "Interactive media systems, game mechanics, and computational creativity.",
                        artifacts: [
                            { type: "project", title: "Pulse Gear", href: "/projects/pulse-gear", note: "Interactive puzzle mechanics and solver strategies." },
                        ]
                    },
                    {
                        courseCode: "CEN4721",
                        course: "Human-Computer Interaction",
                        grade: { letter: "A", symbol: "" },
                        theme: "User-centered design, usability evaluation, and interaction flow optimization.",
                        artifacts: [
                            { type: "project", title: "Splitsy", href: "/projects/splitsy", note: "Mobile app built on the principles of user-centered design for easy and fair splitting of shared expenses." },
                            { type: "presentation", title: "Splitsy Product Demo", href: "/presentations/splitsy-demo", note: "An infomercial style presentation telling the story from why, how, and what of the product, including a situational demo." },
                            { type: "report", title: "Splitsy Final Report", href: "/projects/splitsy", note: "Final report covering user testing results, design decisions, and technical implementation." },
                            { type: "report", title: "Splitsy Implementation Report", href: "/projects/splitsy", note: "Detailed implementation report covering solution vision, design decisions, and technical implementation." },
                            { type: "report", title: "Splitsy Project Proposal", href: "/projects/splitsy", note: "Propose user-research methods, problem framing, and solution architecture." },
                            
                        ]
                    },
                    {
                        courseCode: "CIS4930",
                        course: "Enterprise Software Engineering",
                        grade: { letter: "A", symbol: "" },
                        theme: "Scalable architecture, code quality, CI/CD, and collaborative engineering process.",
                        artifacts: [
                            
                        ]
                    },
                    {
                        courseCode: "GEO2500",
                        course: "Global/Regional Economies",
                        grade: { letter: "A", symbol: "" },
                        theme: "Economic systems, macro trends, and regional market interpretation.",
                        artifacts: [
                            { type: "report", title: "The Gap in Artificial Intelligence Adoption and the Core-Periphery Model", href: "/reports/Nguyen_Jett_Final_Paper.pdf", note: "Final Paper describing the adoption curve of AI based on global economic structures and its implications." },
                            { type: "report", title: "The Coffee Commodity Chain in the Global Economy", href: "/reports/Nguyen_Jett_Module_8_Essay.pdf", note: "Essay explaining the coffee commodity chain, Guatemala's role, and the trade's impact on the global economy." },
                            { type: "report", title: "Cumulative Causation & the Core-Periphery Relationships", href: "/reports/Nguyen_Jett_Module_6_Essay.pdf", note: "Essay describing the phenomenon of cumulative causation and how it can foster growth, but also lead to peripheralization." },
                            { type: "report", title: "The Economy Shaped by Core-Periphery Relationships", href: "/reports/Nguyen_Jett_Module_4_Essay.pdf", note: "Essay analyzing how core-periphery relationships influence and reaffirm economic structures and development." },
                            { type: "report", title: "GDP vs. HDI as a Measurement of Economic Development", href: "/reports/Nguyen_Jett_Module_2_Essay.pdf", note: "Essay comparing GDP and HDI as metrics for assessing economic development." }
                        ]
                    },
                    {
                        courseCode: "PUR4243",
                        course: "Artificial Intelligence in Public Relations",
                        grade: { letter: "A", symbol: "" },
                        theme: "AI-assisted communication strategy, ethics, and practical PR deployment.",
                        artifacts: [
                        ]
                    }
                ]
            },
            {
                term: "Summer",
                termGpa: "3.71",
                classes: [
                    {
                        courseCode: "EIN3354",
                        course: "Engineering Economy",
                        grade: { letter: "B", symbol: "+" },
                        theme: "Cost-benefit modeling, economic decision analysis, and engineering tradeoff evaluation.",
                        artifacts: [
                            { type: "homework", title: "Homeworks 1-5", note: "Homework sets covering engineering economy calculations and decision analysis. Unable to share because the homeworks are trivial and due to student confidentiality." }
                        ]
                    },
                    {
                        courseCode: "PUR4243",
                        course: "Innovation Communications",
                        grade: { letter: "A", symbol: "" },
                        theme: "Communicating new product concepts through strategy, storytelling, and audience positioning.",
                        artifacts: [
                            { type: "presentation", title: "Whisp Product Pitch", href: "/presentations/whisp", note: "Innovation communication framing in hypothetical product context." }
                        ]
                    },
                    {
                        courseCode: "PUR4400C",
                        course: "Crisis Communications",
                        grade: { letter: "A", symbol: "" },
                        theme: "Crisis response frameworks, message control, and stakeholder trust recovery.",
                        artifacts: [
                            { type: "presentation", title: "\"Heart On My Sleeve\" Crisis Case Study", href: "/presentations/crisis-case-study", note: "Crisis communication analysis for the AI-generated song \"Heart On My Sleeve\"" }
                        ]
                    }
                ]
            },
            {
                term: "Spring",
                termGpa: "3.83",
                classes: [
                    {
                        courseCode: "CIS4301",
                        course: "Information and Database Systems",
                        grade: { letter: "B", symbol: "+" },
                        theme: "Data modeling, database querying, and information system design for application workflows.",
                        artifacts: [
                            { type: "homework", title: "Homeworks 1-7", note: "Homework sets focused on relational modeling, SQL, and database concepts. Unable to share because the homeworks are trivial and due to student confidentiality." },
                        ]
                    },
                    {
                        courseCode: "COP4020",
                        course: "Programming Language Concepts",
                        grade: { letter: "A", symbol: "" },
                        theme: "Programming language design principles and implementation.",
                        artifacts: [
                            { type: "project", title: "Programming Language Implementation", note: "A semester-long project building a programming language from the ground up, involving creating a lexer, parser, evaluator, analyzer, and generator in JavaScript. (Unable to share due to student confidentiality.)" }
                        ]
                    },
                    {
                        courseCode: "COP4533",
                        course: "Algorithm Abstraction & Design",
                        grade: { letter: "A", symbol: "" },
                        theme: "Algorithm design patterns, asymptotic analysis, and optimization tradeoffs.",
                        artifacts: [
                            { type: "presentation", title: "Vertex Cover Presentation", href: "/presentations/np-completeness", note: "Presentation covering NP-completeness and NP-hardness of vertex cover." }
                        ]
                    },
                    {
                        courseCode: "PHI3681",
                        course: "Ethics, Data & Technology",
                        grade: { letter: "A", symbol: "" },
                        theme: "Ethical analysis of data systems, responsible AI, and technology impact on society.",
                        artifacts: [
                            { type: "report", title: "AI Ethics Issue Briefs 1-5", note: "Case study reports analyzing ethical considerations and implications of AI. (Unable to share due to student confidentiality.)" }
                        ]
                    }
                ]
            }
        ]
    },
    {
        year: 2024,
        semesters: [
            {
                term: "Fall",
                termGpa: "3.83",
                classes: [
                    {
                        courseCode: "CEN3031",
                        course: "Introduction to Software Engineering",
                        grade: { letter: "", symbol: "" },
                        theme: "Software lifecycle fundamentals, team collaboration, and maintainable project structure.",
                        artifacts: [
                            { type: "presentation", title: "Cloud-Based Architecture", href: "/presentations/cloud-architecture", note: "Analysis of cloud-based architecture." },
                            { type: "presentation", title: "GatorFound Final Presentation", note: "Final presentation for GatorFound (link unavailable)." }
                        ]
                    },
                    {
                        courseCode: "COP4600",
                        course: "Operating Systems",
                        grade: { letter: "B", symbol: "+" },
                        theme: "Processes, memory, scheduling, and systems-level performance reasoning.",
                        artifacts: [
                            { type: "project", title: "Projects 1-3", note: "Unable to share due to student confidentiality." }
                        ]
                    },
                    {
                        courseCode: "ENC3246",
                        course: "Professional Communication for Engineers",
                        grade: { letter: "A", symbol: "" },
                        theme: "Technical writing, audience adaptation, and professional documentation practices.",
                        artifacts: [
                            { type: "report", title: "Therac-25 Failure Analysis Paper", href: "/reports/JettNguyen_FailureAnalysisPaper.pdf", note: "Final paper on the failure analysis of the Therac-25 radiation therapy machine." },
                            { type: "report", title: "AI-Powered Traffic Systems Research Report", href: "/reports/JettNguyen_ResearchReport.pdf", note: "Proposition of AI-powered traffic systems in Gainesville, FL using research gathered from residents." }
                        ]
                    },
                    {
                        courseCode: "PUR4442",
                        course: "Public Interest Communications",
                        grade: { letter: "A", symbol: "" },
                        theme: "Campaign communication for public-good outcomes and stakeholder-centered messaging.",
                        artifacts: [
                            { type: "presentation", title: "Opioid Crisis Communications", href: "/presentations/opioid-crisis", note: "A partnering campaign with Project Opioid for the opioid crisis in Florida." },
                        ]
                    }
                ]
            },
            {
                term: "Summer",
                termGpa: "3.16",
                classes: [
                    {
                        courseCode: "MAS3114",
                        course: "Computational Linear Algebra",
                        grade: { letter: "", symbol: "" },
                        theme: "Matrix-based computation, linear systems, and numerical reasoning in applied contexts.",
                        artifacts: [
                            { type: "homework", title: "MATLAB Assignments 1-4", note: "Homework assignments implementing linear algebra methods in MATLAB. Unable to share because the homeworks are trivial and due to student confidentiality." }
                        ]
                    },
                    {
                        courseCode: "STA3032",
                        course: "Engineering Statistics",
                        grade: { letter: "C", symbol: "+" },
                        theme: "Probabilistic modeling, statistical inference, and data-driven decision support.",
                        artifacts: [
                            { type: "homework", title: "Homeworks 1-3", note: "Homework sets on probability distributions, estimation, and hypothesis testing. Unable to share because the homeworks are trivial and due to student confidentiality." }

                        ]
                    }
                ]
            },
            {
                term: "Spring",
                termGpa: "3.53",
                classes: [
                    {
                        courseCode: "CDA3101",
                        course: "Introduction to Computer Organization",
                        grade: { letter: "A", symbol: "" },
                        theme: "Hardware-software interface fundamentals, low-level execution, and architectural constraints.",
                        artifacts: [
                            { type: "report", title: "Cache Simulation Analysis Paper", note: "Analysis of cache hit rates for different cache sizes and block sizes. Unable to share due to student confidentiality." }
                        ]
                    },
                    {
                        courseCode: "COP3530",
                        course: "Data Structures & Algorithms",
                        grade: { letter: "A", symbol: "-" },
                        theme: "Core data structures, algorithmic tradeoffs, and complexity-driven implementation choices.",
                        artifacts: [
                            { type: "project", title: "Gridiron Guru", href: "/projects/gridiron-guru" },
                            { type: "project", title: "Projects 1 & 2", note: "Projects on AVL Trees and Page Rank. Unable to share due to student confidentiality." }
                        ]
                    },
                    {
                        courseCode: "PHY2049",
                        course: "Physics with Calculus 2",
                        grade: { letter: "C", symbol: "+" },
                        theme: "Modeling dynamic systems with calculus-based analysis and empirical lab validation.",
                        artifacts: [
                        ]
                    },
                    {
                        courseCode: "PHY2049L",
                        course: "Physics with Calculus 2 Lab",
                        grade: { letter: "A", symbol: "" },
                        theme: "Laboratory experiments and practical applications of calculus-based physics concepts.",
                        artifacts: [
                        ]
                    },
                    {
                        courseCode: "PUR3622",
                        course: "Social Media Management",
                        grade: { letter: "A", symbol: "" },
                        theme: "Platform strategy, campaign execution, and engagement analytics for digital audiences.",
                        artifacts: [
                            { type: "presentation", title: "Duolingo Olympics Campaign", href: "/presentations/duolingo", note: "A social media campaign proposal for Duolingo during the 2024 Olympics." },
                            { type: "report", title: "Duolingo Content Calendar", note: "A content calendar for Duolingo during the 2024 Olympics. This document is not publicly shareable due to student confidentiality." },
                            { type: "report", title: "Duolingo Research & Audit", href: "/reports/Duolingo Research & Audit.pdf", note: "A research and audit of Duolingo's social media presence." },
                            { type: "report", title: "Duolingo Campaign Proposal", href: "/reports/Duolingo Campaign Idea.pdf", note: "A social media campaign proposal for Duolingo during the 2024 Olympics." }
                        ]
                    }
                ]
            }
        ]
    },
    {
        year: 2023,
        semesters: [
            {
                term: "Fall",
                termGpa: "3.57",
                classes: [
                    {
                        courseCode: "COP3503C",
                        course: "Programming Fundamentals 2",
                        grade: { letter: "A", symbol: "" },
                        theme: "Intermediate programming design, modularity, and algorithm implementation in larger codebases.",
                        artifacts: [
                            { type: "project", title: "Projects 1-3", note: "Unable to share due to student confidentiality." }
                        ]
                    },
                    {
                        courseCode: "COT3100",
                        course: "Discrete Structures",
                        grade: { letter: "A", symbol: "-" },
                        theme: "Logic, proofs, sets, and combinatorial reasoning for computer science foundations.",
                        artifacts: [
                        ]
                    },
                    {
                        courseCode: "PHY2048",
                        course: "Physics with Calculus 1 (with Lab)",
                        grade: { letter: "B", symbol: "-" },
                        theme: "Mechanics fundamentals, measurement, and quantitative modeling of physical systems.",
                        artifacts: [
                        ]
                    },
                    {
                        courseCode: "PHY2048L",
                        course: "Physics with Calculus 1 Lab",
                        grade: { letter: "A", symbol: "" },
                        theme: "Experimental application of mechanics concepts, data analysis, and scientific reporting.",
                        artifacts: [
                        ]
                    },
                    {
                        courseCode: "PUR3000",
                        course: "Introduction to Public Relations",
                        grade: { letter: "A", symbol: "" },
                        theme: "PR principles, stakeholder mapping, and foundational communication planning.",
                        artifacts: [
                            { type: "homework", title: "Assignments 1-5", note: "Homework assignments on foundational public-relations planning and communication exercises. Unable to share because the homeworks are trivial and due to student confidentiality." },
                        ]
                    }
                ]
            },
            {
                term: "Summer",
                termGpa: "3.04",
                classes: [
                    {
                        courseCode: "IDS2935",
                        course: "Knowledge and the Universe",
                        grade: { letter: "A", symbol: "" },
                        theme: "Interdisciplinary inquiry on scientific reasoning, uncertainty, and knowledge frameworks.",
                        artifacts: [
                            { type: "presentation", title: "A Bayesian Perspective on the Outsourcing Dilemma", href: "/presentations/outsourcing", note: "An analysis of the outsourcing dilemma using Bayesian principles." },
                            { type: "report", title: "Final Writeup: Outsourcing Dilemma", note: "A comprehensive report on the outsourcing dilemma, including a Bayesian analysis. This document is not publicly shareable due to student confidentiality." }
                        ]
                    },
                    {
                        courseCode: "MAC2313",
                        course: "Analytic Geometry & Calculus 3",
                        grade: { letter: "C", symbol: "+" },
                        theme: "Multivariable calculus, vector analysis, and geometric reasoning in higher dimensions.",
                        artifacts: [
                        ]
                    }
                ]
            },
            {
                term: "Spring",
                termGpa: "3.59",
                classes: [
                    {
                        courseCode: "AST1002",
                        course: "Discover the Universe",
                        grade: { letter: "", symbol: "" },
                        theme: "Scientific literacy through astronomy concepts, evidence interpretation, and cosmic-scale reasoning.",
                        artifacts: [
                        ]
                    },
                    {
                        courseCode: "COP3502C",
                        course: "Programming Fundamentals 1",
                        grade: { letter: "A", symbol: "-" },
                        theme: "Foundational programming, control flow, and data handling as a base for software development.",
                        artifacts: [
                            { type: "presentation", title: "Sudoku Python Project", href: "/presentations/sudoku", note: "A demo of a Python project to play Sudoku puzzles using PyGame." }
                        ]
                    },
                    {
                        courseCode: "EGN2020C",
                        course: "Engineering Design & Society",
                        grade: { letter: "A", symbol: "" },
                        theme: "Human-centered design, prototyping, and communication of engineering solutions for real users.",
                        artifacts: [
                            { type: "presentation", title: "Tempo Titan", href: "/presentations/tempo", note: "The human-centered design process for Tempo Titan." }
                        ]
                    },
                    {
                        courseCode: "MAC2312",
                        course: "Analytic Geometry & Calculus 2",
                        grade: { letter: "B", symbol: "" },
                        theme: "Integral calculus, infinite sequences/series, and applied accumulation models.",
                        artifacts: [
                        ]
                    }
                ]
            }
        ]
    },
    {
        year: 2022,
        semesters: [
            {
                term: "Fall",
                termGpa: "3.69",
                classes: [
                    {
                        courseCode: "LIN2614",
                        course: "Language in the USA",
                        grade: { letter: "A", symbol: "" },
                        theme: "Sociolinguistic analysis of language, identity, and communication in U.S. contexts.",
                        artifacts: [
                            { type: "presentation", title: "AppE in the USA", note: "A presentation analyzing the sociolinguistic features of AppE (Appalachian English), stigmas, and its cultural significance." }
                        ]
                    },
                    {
                        courseCode: "MAC2311",
                        course: "Analytic Geometry & Calculus 1",
                        grade: { letter: "B", symbol: "" },
                        theme: "Differential calculus foundations, limits, and modeling rates of change.",
                        artifacts: [
                        ]
                    },
                    {
                        courseCode: "MUL2010",
                        course: "Experiencing Music",
                        grade: { letter: "A", symbol: "" },
                        theme: "Music appreciation through listening frameworks, form analysis, and historical context.",
                        artifacts: [
                        ]
                    },
                    {
                        courseCode: "MUS1610",
                        course: "Music & Spirituality",
                        grade: { letter: "A", symbol: "" },
                        theme: "Cultural and spiritual dimensions of music, interpretation, and expressive meaning.",
                        artifacts: [
                            { type: "presentation", title: "The Spiritual Journey of The Weeknd's Dawn FM", href: "/presentations/the-weeknd", note: "An analysis of The Weeknd's album Dawn FM - themes, production, and link to spirituality." },
                            { type: "report", title: "Capstone Project Report: The Weeknd's Dawn FM", href: "/reports/Capstone Project Final Paper.pdf", note: "A report on The Weeknd's album Dawn FM - themes, production, and link to spirituality." }
                        ]
                    }
                ]
            }
        ]
    }
];
