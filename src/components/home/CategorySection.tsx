import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { experiences } from "@/data/experiences";
import { EXPERIENCE_CATEGORIES, EXPERIENCE_CATEGORY_LABELS } from "@/types/experience";

const categoryImages = {
  Adventure: "/images/categories/adventure.jpeg",
  Culture: "/images/categories/culture.jpeg",
  Food: "/images/categories/food.jpeg",
  Wellness: "/images/categories/wellness.jpeg",
  Nature: "/images/categories/nature.jpeg",
} as const;

export function CategorySection() {
  return (
    <section className="home-section category-section" aria-labelledby="categories-title">
      <div className="section-heading">
        <div><p className="eyebrow">Encuentra tu próxima historia</p><h2 id="categories-title">Explora por categoría</h2></div>
        <p>Elige el tipo de experiencia que más te inspira.</p>
      </div>
      <div className="category-grid">
        {EXPERIENCE_CATEGORIES.map((category) => {
          const count = experiences.filter((experience) => experience.category === category).length;
          return (
            <Link className="category-card" href={`/experiences?category=${encodeURIComponent(category)}`} key={category}>
              <Image src={categoryImages[category]} alt="" fill sizes="(max-width: 42rem) 80vw, (max-width: 70rem) 30vw, 18vw" />
              <span className="category-shade" />
              <span className="category-card-copy">
                <strong>{EXPERIENCE_CATEGORY_LABELS[category]}</strong>
                <small>{count} experiencias <ArrowUpRight aria-hidden="true" size={16} /></small>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
