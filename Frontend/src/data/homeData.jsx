import {
  FaUsers,
  FaCode,
  FaRocket,
  FaShieldAlt,
  FaMobile,
  FaBrain,
  FaBook,
  FaRoad,
  FaCloud,
  FaExternalLinkAlt,
  FaGitAlt,
  FaGithub,
  FaLink,
  FaMicrochip,
  FaPalette,
  FaMap,
  FaQuestionCircle,
  FaCalendarAlt,
  FaGraduationCap,
} from "react-icons/fa";

export const colors = {
  blue: "#4285f4",
  green: "#34a853",
  yellow: "#f9ab00",
  red: "#ea4335",
};

export const homeStats = [
  {
    number: "4500+",
    label: "Members",
    icon: <FaUsers />,
    color: colors.blue,
  },
  {
    number: "50+",
    label: "Events",
    icon: <FaCode />,
    color: colors.green,
  },
  {
    number: "100+",
    label: "Projects",
    icon: <FaRocket />,
    color: colors.yellow,
  },
];

export const techStacks = [
  {
    id: 1,
    title: "Web Development",
    icon: <FaCode />,
    color: colors.blue,
    description:
      "Master modern web technologies and build responsive, interactive websites and web applications.",
    cards: [
      { title: "Frontend", desc: "HTML, CSS, JavaScript, React, Vue" },
      { title: "Backend", desc: "Node.js, Express, MongoDB, APIs" },
      { title: "Frameworks", desc: "Next.js, Angular, Svelte" },
    ],
    facilitator: "Connect with Web Dev Experts",
    resources: [
      {
        name: "MDN Web Docs",
        icon: <FaBook />,
        link: "https://developer.mozilla.org/",
      },
      {
        name: "Roadmap.sh",
        icon: <FaMap />,
        link: "https://roadmap.sh/frontend",
      },
      {
        name: "FreeCodeCamp",
        icon: <FaCode />,
        link: "https://www.freecodecamp.org/",
      },
    ],
  },
  {
    id: 2,
    title: "Mobile Development",
    icon: <FaMobile />,
    color: colors.green,
    description:
      "Build cross-platform mobile applications using Flutter, React Native, and native technologies.",
    cards: [
      { title: "Flutter", desc: "Dart, Widgets, Firebase Integration" },
      { title: "React Native", desc: "JavaScript, Native Modules" },
      { title: "Android/iOS", desc: "Kotlin, Swift, Native Development" },
    ],
    facilitator: "Connect with Mobile Dev Mentors",
    resources: [
      {
        name: "Flutter Docs",
        icon: <FaBook />,
        link: "https://docs.flutter.dev/",
      },
      {
        name: "React Native",
        icon: <FaMobile />,
        link: "https://reactnative.dev/",
      },
      {
        name: "App Brewery",
        icon: <FaRocket />,
        link: "https://www.appbrewery.com/",
      },
    ],
  },
  {
    id: 3,
    title: "AI & Machine Learning",
    icon: <FaBrain />,
    color: colors.yellow,
    description:
      "Explore artificial intelligence, machine learning models, and data science applications.",
    cards: [
      {
        title: "Machine Learning",
        desc: "Python, TensorFlow, Scikit-learn",
      },
      { title: "Deep Learning", desc: "Neural Networks, PyTorch, Keras" },
      {
        title: "Data Science",
        desc: "Pandas, NumPy, Data Visualization",
      },
    ],
    facilitator: "Connect with AI/ML Researchers",
    resources: [
      {
        name: "TensorFlow",
        icon: <FaBrain />,
        link: "https://www.tensorflow.org/",
      },
      {
        name: "Kaggle",
        icon: <FaBook />,
        link: "https://www.kaggle.com/",
      },
      {
        name: "Fast.ai",
        icon: <FaRocket />,
        link: "https://www.fast.ai/",
      },
    ],
  },
  {
    id: 4,
    title: "Cloud Computing",
    icon: <FaCloud />,
    color: colors.red,
    description:
      "Learn cloud platforms, DevOps, and scalable infrastructure management.",
    cards: [
      { title: "Google Cloud", desc: "GCP, Firebase, Cloud Functions" },
      { title: "AWS", desc: "EC2, S3, Lambda, AWS Services" },
      { title: "DevOps", desc: "Docker, Kubernetes, CI/CD" },
    ],
    facilitator: "Connect with Cloud Architects",
    resources: [
      {
        name: "Google Cloud",
        icon: <FaCloud />,
        link: "https://cloud.google.com/",
      },
      {
        name: "AWS Educate",
        icon: <FaBook />,
        link: "https://aws.amazon.com/education/awseducate/",
      },
      {
        name: "Docker Docs",
        icon: <FaCode />,
        link: "https://docs.docker.com/",
      },
    ],
  },
  {
    id: 5,
    title: "Cyber Security",
    icon: <FaShieldAlt />,
    color: colors.blue,
    description:
      "Protect systems and networks from digital attacks and ensure data security.",
    cards: [
      {
        title: "Network Security",
        desc: "Firewalls, VPNs, Intrusion Detection",
      },
      {
        title: "Ethical Hacking",
        desc: "Penetration Testing, Vulnerability Assessment",
      },
      {
        title: "Cryptography",
        desc: "Encryption, Digital Signatures, SSL/TLS",
      },
    ],
    facilitator: "Connect with Security Experts",
    resources: [
      {
        name: "Cybrary",
        icon: <FaShieldAlt />,
        link: "https://www.cybrary.it/",
      },
      {
        name: "TryHackMe",
        icon: <FaBook />,
        link: "https://tryhackme.com/",
      },
      {
        name: "OWASP",
        icon: <FaExternalLinkAlt />,
        link: "https://owasp.org/",
      },
    ],
  },
  {
    id: 6,
    title: "Git & GitHub",
    icon: <FaGitAlt />,
    color: colors.green,
    description:
      "Master version control and collaborative development with Git and GitHub.",
    cards: [
      { title: "Version Control", desc: "Commits, Branches, Merging" },
      { title: "Collaboration", desc: "Pull Requests, Code Review" },
      { title: "CI/CD", desc: "GitHub Actions, Automation" },
    ],
    facilitator: "Connect with Git Experts",
    resources: [
      {
        name: "Git Docs",
        icon: <FaBook />,
        link: "https://git-scm.com/doc",
      },
      {
        name: "GitHub Learning",
        icon: <FaGithub />,
        link: "https://docs.github.com/en/get-started",
      },
      {
        name: "Learn Git Branching",
        icon: <FaCode />,
        link: "https://learngitbranching.js.org/",
      },
    ],
  },
  {
    id: 7,
    title: "Blockchain",
    icon: <FaLink />,
    color: colors.yellow,
    description:
      "Explore decentralized applications, smart contracts, and Web3 technologies.",
    cards: [
      { title: "Smart Contracts", desc: "Solidity, Ethereum, Web3.js" },
      { title: "DApps", desc: "Decentralized Applications" },
      { title: "Cryptocurrency", desc: "Bitcoin, NFTs, DeFi" },
    ],
    facilitator: "Connect with Blockchain Developers",
    resources: [
      {
        name: "Ethereum.org",
        icon: <FaLink />,
        link: "https://ethereum.org/",
      },
      {
        name: "Solidity Docs",
        icon: <FaBook />,
        link: "https://docs.soliditylang.org/",
      },
      {
        name: "Web3 University",
        icon: <FaRocket />,
        link: "https://www.web3.university/",
      },
    ],
  },
  {
    id: 8,
    title: "IoT",
    icon: <FaMicrochip />,
    color: colors.red,
    description:
      "Build connected devices and smart systems with Internet of Things technology.",
    cards: [
      {
        title: "Embedded Systems",
        desc: "Arduino, Raspberry Pi, Sensors",
      },
      { title: "Protocols", desc: "MQTT, HTTP, Bluetooth" },
      { title: "Cloud Integration", desc: "AWS IoT, Google IoT Core" },
    ],
    facilitator: "Connect with IoT Engineers",
    resources: [
      {
        name: "Arduino",
        icon: <FaMicrochip />,
        link: "https://www.arduino.cc/",
      },
      {
        name: "Raspberry Pi",
        icon: <FaBook />,
        link: "https://www.raspberrypi.com/",
      },
      {
        name: "IoT Tutorials",
        icon: <FaCode />,
        link: "https://iotbyhvm.ooo/",
      },
    ],
  },
  {
    id: 9,
    title: "Graphic Design",
    icon: <FaPalette />,
    color: colors.blue,
    description:
      "Create stunning visual designs and user interfaces for digital products.",
    cards: [
      { title: "UI/UX Design", desc: "Figma, Adobe XD, User Research" },
      { title: "Graphics", desc: "Photoshop, Illustrator, Canva" },
      {
        title: "Prototyping",
        desc: "Wireframing, Mockups, Design Systems",
      },
    ],
    facilitator: "Connect with Design Experts",
    resources: [
      {
        name: "Figma Community",
        icon: <FaPalette />,
        link: "https://www.figma.com/community",
      },
      {
        name: "Behance",
        icon: <FaBook />,
        link: "https://www.behance.net/",
      },
      {
        name: "Dribbble",
        icon: <FaExternalLinkAlt />,
        link: "https://dribbble.com/",
      },
    ],
  },
];

export const faqCategories = [
  {
    id: "general",
    title: "General Questions",
    icon: <FaQuestionCircle />,
    color: colors.blue,
    questions: [
      {
        question: "What is Google Developer Groups (GDG)?",
        answer:
          "GDG is a global community of developers passionate about Google's technologies. We organize workshops, study jams, and networking events to help developers learn and grow together.",
      },
      {
        question: "Who can join GDG?",
        answer:
          "Anyone interested in technology! Whether you're a beginner, student, professional, or expert - all are welcome. No prior experience required.",
      },
      {
        question: "Is there any membership fee?",
        answer:
          "No! GDG is completely free to join. All our events and resources are available at no cost to the community.",
      },
    ],
  },
  {
    id: "events",
    title: "Events & Activities",
    icon: <FaCalendarAlt />,
    color: colors.green,
    questions: [
      {
        question: "What kind of events does GDG organize?",
        answer:
          "We host workshops, tech talks, hackathons, study jams, coding competitions, and networking events covering various Google technologies and developer tools.",
      },
      {
        question: "How often are events conducted?",
        answer:
          "We typically host 2-3 events per month, including weekly study sessions, monthly workshops, and quarterly major events like hackathons.",
      },
      {
        question: "Can I suggest or host an event?",
        answer:
          "Absolutely! We encourage community members to propose and host events. Reach out to our team with your idea.",
      },
    ],
  },
  {
    id: "learning",
    title: "Learning & Resources",
    icon: <FaGraduationCap />,
    color: colors.yellow,
    questions: [
      {
        question: "What technologies will I learn?",
        answer:
          "Android, Flutter, Web Technologies, Google Cloud, Firebase, Machine Learning, TensorFlow, and many more Google developer technologies.",
      },
      {
        question: "Do I need prior experience to participate?",
        answer:
          "Not at all! We have tracks for complete beginners to advanced developers. Our community helps everyone learn at their own pace.",
      },
      {
        question: "Are there any learning resources provided?",
        answer:
          "Yes! We provide curated learning paths, documentation, video tutorials, and access to Google's developer resources.",
      },
    ],
  },
  {
    id: "community",
    title: "Community & Networking",
    icon: <FaUsers />,
    color: colors.red,
    questions: [
      {
        question: "How can I connect with other members?",
        answer:
          "Join our Discord server, attend events, participate in study groups, and connect through our social media channels.",
      },
      {
        question: "Are there opportunities for collaboration?",
        answer:
          "Yes! You can collaborate on projects, participate in team hackathons, and join special interest groups based on your interests.",
      },
      {
        question: "Can I become a speaker or facilitator?",
        answer:
          "Definitely! We're always looking for community members to share their knowledge. Contact us to become a speaker.",
      },
    ],
  },
];
