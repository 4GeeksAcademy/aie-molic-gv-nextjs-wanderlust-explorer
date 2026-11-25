import Link from "next/link";
import { experiences } from "@/data/experiences";
import { EXPERIENCE_CATEGORY_LABELS } from "@/types/experience";
import { ExperienceFavoriteButton } from "@/components/favorites/ExperienceFavoriteButton";

export default function ExperiencesPage() {
  return (
    <section className="page-shell" aria-labelledby="page-title">
      <h1 className="page-title" id="page-title">Experiencias</h1>
      <p className="page-description">
        Página provisional de navegación. Catálogo disponible: {experiences.length} experiencias.
      </p>
      <ul className="foundation-list">
        {experiences.slice(0, 5).map((experience) => (
          <li key={experience.id}>
            <Link href={`/experiences/${experience.id}`}>
              {experience.title} · {EXPERIENCE_CATEGORY_LABELS[experience.category]}
            </Link>
            <ExperienceFavoriteButton experienceId={experience.id} />
          </li>
        ))}
      </ul>
    </section>
  );
}
