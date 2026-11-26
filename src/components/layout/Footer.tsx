import Link from "next/link";

export function Footer() {
  return (
    <footer className="home-footer">
      <div><Link className="footer-brand" href="/">Wanderlust Explorer</Link><p>Historias y experiencias para descubrir el mundo con curiosidad.</p></div>
      <nav aria-label="Enlaces del pie de página"><Link href="/experiences">Experiencias</Link><Link href="/favorites">Favoritos</Link><Link href="/profile">Perfil</Link></nav>
      <small>© Wanderlust Explorer</small>
    </footer>
  );
}
