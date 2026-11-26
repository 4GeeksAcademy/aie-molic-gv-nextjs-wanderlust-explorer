import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { experiences } from "@/data/experiences";
import { ExperienceCard } from "@/components/experiences/ExperienceCard";

const FEATURED_IDS = [
  "adventure-001",
  "culture-001",
  "food-001",
  "wellness-001",
  "nature-001",
  "adventure-002",
] as const;

const featured = FEATURED_IDS.map((id) => experiences.find((experience) => experience.id === id)).filter((experience) => experience !== undefined);

export function FeaturedExperiences() {
  return (
    <section className="home-section featured-section" aria-labelledby="featured-title">
      <div className="section-heading">
        <div><p className="eyebrow">Selección para inspirarte</p><h2 id="featured-title">Experiencias destacadas</h2></div>
        <Link className="section-link" href="/experiences">Ver las {experiences.length} experiencias <ArrowRight aria-hidden="true" size={18} /></Link>
      </div>
      <div className="experience-grid">
        {featured.map((experience) => <ExperienceCard key={experience.id} experience={experience} />)}
      </div>
    </section>
  );
}
