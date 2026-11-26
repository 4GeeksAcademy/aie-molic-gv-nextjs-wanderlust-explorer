import Link from "next/link";
import { Compass } from "lucide-react";

export default function ExperienceDetailNotFound() {
  return (
    <section className="detail-not-found" aria-labelledby="detail-not-found-title">
      <span className="detail-not-found-icon"><Compass aria-hidden="true" size={34} strokeWidth={1.6} /></span>
      <h1 id="detail-not-found-title">Experiencia no encontrada</h1>
      <p>Esta experiencia no está disponible. Todavía quedan muchos lugares por descubrir</p>
      <Link className="detail-not-found-link" href="/experiences">Volver a experiencias</Link>
    </section>
  );
}
