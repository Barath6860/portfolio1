import { profile, socialLinks } from "@/data/profile";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollUI } from "@/components/layout/ScrollUI";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { TechArsenal } from "@/components/sections/TechArsenal";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { Achievements } from "@/components/sections/Achievements";
import { Contact } from "@/components/sections/Contact";
import { CommandPalette } from "@/components/interactive/CommandPalette";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: profile.siteUrl,
  email: `mailto:${profile.email}`,
  jobTitle: profile.subRole,
  description: profile.summary,
  sameAs: socialLinks.map((l) => l.href),
  knowsAbout: profile.interests,
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <ScrollUI />
      <Navbar />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <About />
        <TechArsenal />
        <ProjectsSection />
        <Achievements />
        <Contact />
      </main>
      <CommandPalette />
    </>
  );
}
