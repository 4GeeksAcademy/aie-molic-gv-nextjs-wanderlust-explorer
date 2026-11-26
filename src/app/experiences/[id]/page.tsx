import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Star } from "lucide-react";
import { experiences } from "@/data/experiences";
import { ExperienceCard } from "@/components/experiences/ExperienceCard";
import { ExperienceFavoriteButton } from "@/components/favorites/ExperienceFavoriteButton";
import { ExperienceDetailImage } from "@/components/experiences/ExperienceDetailImage";
import { EXPERIENCE_CATEGORY_LABELS } from "@/types/experience";

const euro = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });

type ExperienceDetailPageProps = PageProps<"/experiences/[id]">;
type ExperienceDetailParams = ExperienceDetailPageProps["params"];

export default function ExperienceDetailPage({ params }: ExperienceDetailPageProps) {
  return (
    <Suspense fallback={<div className="detail-page" aria-busy="true" />}>
      <ExperienceDetailContent params={params} />
    </Suspense>
  );
}

async function ExperienceDetailContent({ params }: { params: ExperienceDetailParams }) {
  const { id } = await params;
  const experience = experiences.find((item) => item.id === id);

  if (!experience) notFound();

  const relatedExperiences = experiences
    .filter((item) => item.category === experience.category && item.id !== experience.id)
    .slice(0, 3);

  return (
    <div className="detail-page">
      <div className="detail-shell">
        <Link className="detail-back-link" href="/experiences">
          <ArrowLeft aria-hidden="true" size={18} />
          Volver a experiencias
        </Link>

        <div className="detail-layout">
          <article className="detail-main" aria-labelledby="experience-title">
            <div className="detail-image-wrap">
              <ExperienceDetailImage imageUrl={experience.imageUrl} title={experience.title} />
            </div>
            <div className="detail-copy">
              <p className="experience-category-label">{EXPERIENCE_CATEGORY_LABELS[experience.category]}</p>
              <h1 className="detail-title" id="experience-title">{experience.title}</h1>
              <p className="detail-location"><MapPin aria-hidden="true" size={19} /> {experience.destination.city}, {experience.destination.country}</p>
              <p className="detail-rating" aria-label={`Valoración: ${experience.rating.toFixed(1)} de 5`}>
                <Star aria-hidden="true" size={19} fill="currentColor" />
                <span>{experience.rating.toFixed(1)}</span>
              </p>
              <p className="detail-description">{experience.description}</p>
            </div>
          </article>

          <aside className="detail-price-card" aria-label="Precio y favoritos">
            <p className="detail-price-label">Precio</p>
            <p className="detail-price">{euro.format(experience.price)}</p>
            <ExperienceFavoriteButton experienceId={experience.id} title={experience.title} showLabel />
          </aside>
        </div>

        {relatedExperiences.length > 0 ? (
          <section className="detail-related" aria-labelledby="related-title">
            <div className="section-heading">
              <h2 id="related-title">También te puede interesar</h2>
            </div>
            <div className="experience-grid">
              {relatedExperiences.map((related) => (
                <ExperienceCard key={related.id} experience={related} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
