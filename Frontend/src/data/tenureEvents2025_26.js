import solutionChallengeCover from "../assets/images/solution-challenge-2026.png";
import n8nCover from "../assets/images/n8n-agentic-2026.png";
import cloudGiftsCover from "../assets/images/cloud-study-gifts-2026.png";
import webUnmaskedCover from "../assets/images/web-unmasked-2026.png";
import capablCover from "../assets/images/capabl-agentic-2026.png";
import techSprintCover from "../assets/images/techsprint-2026.png";
import cloudBootcampCover from "../assets/images/cloud-computing-bootcamp-2025.png";
import cloudStudyJamCover from "../assets/images/cloud-study-jam-2025.png";
import freshmenCover from "../assets/images/freshmen-info-2025.png";

const chapterUrl =
  "https://gdg.community.dev/gdg-on-campus-quantum-university-roorkee-india/";
const chapterName = "GDG on Campus Quantum University - Roorkee, India";
const venue = "Quantum University, Roorkee";
const speakers = ["GDG on Campus Quantum University"];

const createEvent = ({ id, title, date, cover, description, gdgUrl = chapterUrl, type = "workshop" }) => ({
  _id: id,
  tenure: "2025–26",
  source: "gdg-community",
  registrationLabel: "Free registration",
  communityName: chapterName,
  title,
  type,
  date_from: `${date}T12:00:00+05:30`,
  cover,
  description,
  speakers,
  venue,
  participantCount: 0,
  maxParticipants: 1,
  isEnrolled: false,
  photos: [],
  gdgUrl,
});

export const tenureEvents2025_26 = [
  createEvent({
    id: "gdg-solution-challenge-2026",
    title: "Build with AI – Solution Challenge 2026",
    date: "2026-05-15",
    cover: solutionChallengeCover,
    type: "hackathon",
    description:
      "An in-person introduction to the Solution Challenge, covering team formation, real-world problem selection, and building AI-powered solutions with Google technologies.",
    gdgUrl:
      "https://gdg.community.dev/events/details/google-gdg-on-campus-quantum-university-roorkee-india-presents-build-with-ai-solution-challenge-2026/",
  }),
  createEvent({
    id: "gdg-n8n-agentic-workflows-2026",
    title: "n8n and Agentic Workflows",
    date: "2026-05-11",
    cover: n8nCover,
    description:
      "A two-day hands-on workshop introducing AI-powered workflows, intelligent agents, and automations using n8n and Agentic AI tools.",
    gdgUrl:
      "https://gdg.community.dev/events/details/google-gdg-on-campus-quantum-university-roorkee-india-presents-n8n-and-agentic-workflows/",
  }),
  createEvent({
    id: "gdg-cloud-study-jams-gift-distribution-2026",
    title: "Google Cloud Study Jams Gift Distribution",
    date: "2026-04-24",
    cover: cloudGiftsCover,
    description:
      "A celebration of the Google Cloud Study Jams cohort and a distribution of gifts to participating learners.",
    gdgUrl:
      "https://gdg.community.dev/events/details/google-gdg-on-campus-quantum-university-roorkee-india-presents-google-cloud-study-jams-gift-distribution/",
  }),
  createEvent({
    id: "gdg-web-unmasked-2026",
    title: "Web Unmasked",
    date: "2026-03-10",
    cover: webUnmaskedCover,
    description:
      "A hands-on, multi-day workshop exploring how the web works, including internet fundamentals, client-server communication, and real-time applications.",
    gdgUrl:
      "https://gdg.community.dev/events/details/google-gdg-on-campus-quantum-university-roorkee-india-presents-web-unmasked/",
  }),
  createEvent({
    id: "gdg-quantum-capabl-agentic-ai-2026",
    title: "GDG Quantum X Capabl: Agentic AI Workshop",
    date: "2026-02-27",
    cover: capablCover,
    type: "seminar",
    description:
      "A workshop introducing autonomous AI agents, their real-world applications, and emerging career opportunities, hosted with Capabl.",
    gdgUrl:
      "https://gdg.community.dev/events/details/google-gdg-on-campus-quantum-university-roorkee-india-presents-gdg-quantum-x-capabl-agentic-ai-workshop/",
  }),
  createEvent({
    id: "gdg-techsprint-winner-announcement-2026",
    title: "Techsprint Winner Announcement",
    date: "2026-01-19",
    cover: techSprintCover,
    type: "seminar",
    description:
      "The TechSprint finale, celebrating participating teams and announcing the winning projects.",
    gdgUrl:
      "https://gdg.community.dev/events/details/google-gdg-on-campus-quantum-university-roorkee-india-presents-techsprint-winner-announcement/",
  }),
  createEvent({
    id: "gdg-techsprint-round-2-2026",
    title: "TechSprint Round 2",
    date: "2026-01-05",
    cover: techSprintCover,
    type: "hackathon",
    description:
      "A TechSprint build and showcase round where teams work together on real-world challenges and present their solutions.",
    gdgUrl:
      "https://gdg.community.dev/events/details/google-gdg-on-campus-quantum-university-roorkee-india-presents-techsprint-round-2/",
  }),
  createEvent({
    id: "gdg-techsprint-round-1-2025",
    title: "TechSprint Round 1",
    date: "2025-12-20",
    cover: techSprintCover,
    type: "hackathon",
    description:
      "An information and kickoff session for TechSprint, covering the challenge, tracks, team formation, mentors, and prizes.",
    gdgUrl:
      "https://gdg.community.dev/events/details/google-gdg-on-campus-quantum-university-roorkee-india-presents-techsprint-round-1/",
  }),
  createEvent({
    id: "gdg-google-cloud-study-jams-2025-11-19",
    title: "Google Cloud Study Jams",
    date: "2025-11-19",
    cover: cloudBootcampCover,
    description:
      "A Google Cloud learning session for students at Quantum University.",
  }),
  createEvent({
    id: "gdg-google-cloud-study-jams-2025-11-18",
    title: "Google Cloud Study Jams",
    date: "2025-11-18",
    cover: cloudBootcampCover,
    description:
      "An introduction to cloud computing and Google Cloud technologies for students at Quantum University.",
    gdgUrl:
      "https://gdg.community.dev/events/details/google-gdg-on-campus-quantum-university-roorkee-india-presents-google-cloud-study-jams/",
  }),
  createEvent({
    id: "gdg-cloud-study-jam-2025-10-07",
    title: "Cloud Study Jam",
    date: "2025-10-07",
    cover: cloudStudyJamCover,
    type: "seminar",
    description: "A Google Cloud Study Jam session hosted by the GDG chapter.",
  }),
  createEvent({
    id: "gdg-info-session-freshmen-induction-2025",
    title: "GDG Info Session X Freshmen Induction",
    date: "2025-09-24",
    cover: freshmenCover,
    type: "seminar",
    description:
      "An introduction to GDG on Campus, its community, and opportunities to learn, build, and grow at Quantum University.",
    gdgUrl:
      "https://gdg.community.dev/events/details/google-gdg-on-campus-quantum-university-roorkee-india-presents-gdg-info-session-x-freshmen-induction/",
  }),
];
