import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { experiences } from "@/data/experiences";
import { ExperienceSearch } from "@/components/home/ExperienceSearch";
import { CategorySection } from "@/components/home/CategorySection";
import { FeaturedExperiences } from "@/components/home/FeaturedExperiences";

export default function HomePage() {
  const countries = [...new Set(experiences.map((experience) => experience.destination.country))].sort((a, b) => a.localeCompare(b, "es"));

  return (
    <div className="home-page">
      <section className="home-hero" aria-labelledby="home-title">
        <Image className="home-hero-image" src="/images/home/hero.jpeg" alt="" fill priority sizes="100vw" />
        <div className="home-hero-overlay" />
        <div className="home-hero-content">
          <p className="hero-kicker">Wanderlust Explorer · Viaja con curiosidad</p>
          <h1 id="home-title">El mundo está lleno de historias por descubrir</h1>
          <p>Encuentra experiencias auténticas y descubre cada destino a través de quienes lo conocen mejor.</p>
          <Link className="hero-cta" href="/experiences">Explorar experiencias <ArrowRight aria-hidden="true" size={18} /></Link>
        </div>
      </section>
      <div className="home-search-wrap"><ExperienceSearch countries={countries} /></div>
      <CategorySection />
      <FeaturedExperiences />
      <footer className="home-footer">
        <div><Link className="footer-brand" href="/">Wanderlust Explorer</Link><p>Historias y experiencias para descubrir el mundo con curiosidad.</p></div>
        <nav aria-label="Enlaces del pie de página"><Link href="/experiences">Experiencias</Link><Link href="/favorites">Favoritos</Link><Link href="/profile">Perfil</Link></nav>
        <small>© Wanderlust Explorer</small>
      </footer>
    </div>
  );
}
