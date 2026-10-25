/**
 * Certifications and achievements shown in the Achievements section.
 *
 * Add entries exactly as they appear on LinkedIn. Only list items you can
 * back up — `credentialUrl` should point to the issuer's verification page
 * when one exists. While both lists are empty, the section shows a link to
 * the LinkedIn profile instead of placeholder content.
 */

export type Certification = {
  title: string;
  issuer: string;
  /** e.g. "Jan 2026" */
  date?: string;
  credentialUrl?: string;
  skills?: string[];
};

export type Achievement = {
  title: string;
  /** Event, organisation or context, e.g. "College hackathon". */
  context: string;
  date?: string;
  description?: string;
  url?: string;
  /** Photo in /public, e.g. "/achievements/team.jpg". */
  image?: string;
  /** Short highlight shown on the photo, e.g. "Finalist". */
  badge?: string;
};

export const certifications: Certification[] = [];

export const achievements: Achievement[] = [
  {
    title: "HackElite 2026",
    context: "24-hour hackathon",
    badge: "Finalist",
    description: "Cleared two elimination rounds and reached the final.",
    image: "/achievements/hackelite.jpg",
  },
  {
    title: "Prompt-A-Thon",
    context: "AI hackathon",
    badge: "Participant",
    description: "Built with generative AI and prompt engineering as part of a team.",
    image: "/achievements/promptathon.jpg",
  },
  {
    title: "Hackathon teamwork",
    context: "Team builds",
    badge: "Team",
    description: "Designing, coding and pitching under time pressure with my team.",
    image: "/achievements/team.jpg",
  },
];
