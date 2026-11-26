import Image from "next/image";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import { EXPERIENCE_CATEGORY_LABELS, type Experience } from "@/types/experience";
import { ExperienceFavoriteButton } from "@/components/favorites/ExperienceFavoriteButton";

const euro = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });

export function ExperienceCard({ experience }: { experience: Experience }) {
  return (
    <article className="experience-card">
      <div className="experience-card-image">
        <Link href={`/experiences/${experience.id}`} aria-label={`Ver ${experience.title}`}>
          <Image src={experience.imageUrl} alt={experience.title} fill sizes="(max-width: 42rem) 90vw, (max-width: 70rem) 45vw, 30vw" />
        </Link>
        <ExperienceFavoriteButton experienceId={experience.id} title={experience.title} />
      </div>
      <div className="experience-card-content">
        <p className="experience-category-label">{EXPERIENCE_CATEGORY_LABELS[experience.category]}</p>
        <h3><Link href={`/experiences/${experience.id}`}>{experience.title}</Link></h3>
        <p className="experience-location"><MapPin aria-hidden="true" size={16} /> {experience.destination.city}, {experience.destination.country}</p>
        <div className="experience-card-meta">
          <span className="experience-rating"><Star aria-hidden="true" size={16} fill="currentColor" /> {experience.rating.toFixed(1)}</span>
          <span className="experience-price">{euro.format(experience.price)} <small>/ persona</small></span>
        </div>
      </div>
    </article>
  );
}
