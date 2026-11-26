import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { experiences } from "@/data/experiences";
import { EXPERIENCE_CATEGORY_LABELS } from "@/types/experience";
import { ExperienceFavoriteButton } from "@/components/favorites/ExperienceFavoriteButton";

export default function ExperienceDetailPage({
  params,
}: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<p className="page-shell">Cargando experiencia…</p>}>
      <ExperienceDetail params={params} />
    </Suspense>
  );
}

async function ExperienceDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const experience = experiences.find((item) => item.id === id);

  if (!experience) {
    notFound();
  }

  return (
    <section className="page-shell" aria-labelledby="page-title">
      <p className="eyebrow">{EXPERIENCE_CATEGORY_LABELS[experience.category]}</p>
      <h1 className="page-title" id="page-title">{experience.title}</h1>
      <p className="page-description">{experience.destination.city}, {experience.destination.country}</p>
      <ExperienceFavoriteButton experienceId={experience.id} title={experience.title} />
      <Link href="/experiences">Volver a experiencias</Link>
    </section>
  );
}
