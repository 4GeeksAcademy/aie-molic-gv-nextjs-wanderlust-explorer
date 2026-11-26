"use client";

import Link from "next/link";
import { Compass, Heart } from "lucide-react";
import { useFavorites } from "@/components/favorites/FavoritesProvider";
import styles from "./profile.module.css";

export default function ProfilePage() {
  const { favoriteCount } = useFavorites();

  return (
    <section className="page-shell" aria-labelledby="page-title">
      <div className={styles.heading}>
        <h1 className="page-title" id="page-title">Mi perfil</h1>
        <p className="page-description">
          Un rincón personal para tener a mano tus viajes y experiencias favoritas.
        </p>
      </div>

      <div className={styles.layout}>
        <section className={styles.card} aria-labelledby="profile-name">
          <div className={styles.avatar} aria-hidden="true">LM</div>
          <div className={styles.identity}>
            <p className={styles.eyebrow}>Viajera exploradora</p>
            <h2 id="profile-name">Lucía Méndez</h2>
            <a className={styles.email} href="mailto:lucia.mendez@example.com">
              lucia.mendez@example.com
            </a>
            <p className={styles.bio}>
              Me inspiran los caminos menos transitados, la cultura local y las historias que hacen único cada destino.
            </p>
          </div>
        </section>

        <section className={styles.favorites} aria-labelledby="profile-favorites-title">
          <div className={styles.favoritesCopy}>
            <span className={styles.favoritesIcon} aria-hidden="true">
              <Heart size={22} strokeWidth={1.8} />
            </span>
            <div>
              <h2 id="profile-favorites-title">Mis favoritos</h2>
              <p>Experiencias que guardaste para tu próximo viaje.</p>
            </div>
          </div>
          <p className={styles.count} aria-live="polite" aria-atomic="true">
            <strong>{favoriteCount}</strong>
            <span>{favoriteCount === 1 ? "experiencia guardada" : "experiencias guardadas"}</span>
          </p>
          <Link className={styles.favoritesLink} href="/favorites">Ver mis favoritos</Link>
        </section>
      </div>

      <div className={styles.explore}>
        <div>
          <h2>¿Listo para tu próxima aventura?</h2>
          <p>Encuentra nuevas experiencias y empieza a imaginar tu siguiente viaje.</p>
        </div>
        <Link className={styles.exploreLink} href="/experiences">
          Explorar experiencias <Compass aria-hidden="true" size={18} />
        </Link>
      </div>
    </section>
  );
}
