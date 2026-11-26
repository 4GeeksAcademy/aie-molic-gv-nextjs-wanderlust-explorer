"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { Compass, Heart, House, UserRound } from "lucide-react";
import { useFavorites } from "@/components/favorites/FavoritesProvider";

const links = [
  { href: "/", label: "Inicio", icon: House },
  { href: "/experiences", label: "Experiencias", icon: Compass },
  { href: "/favorites", label: "Favoritos", icon: Heart },
  { href: "/profile", label: "Perfil", icon: UserRound },
] as const;

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/experiences") {
    return pathname === href || pathname.startsWith(`${href}/`);
  }
  return pathname === href;
}

function NavbarContent() {
  const pathname = usePathname();
  const { favoriteCount } = useFavorites();

  return (
    <>
      <a className="skip-link" href="#contenido-principal">
        Saltar al contenido
      </a>
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Wanderlust Explorer, inicio">
          <Compass aria-hidden="true" size={24} strokeWidth={1.8} />
          <span>Wanderlust</span>
        </Link>
        <nav aria-label="Navegación principal">
          <ul className="nav-list">
            {links.map(({ href, label, icon: Icon }) => {
              const active = isActivePath(pathname, href);
              return (
                <li key={href}>
                  <Link
                    className={`nav-link${active ? " is-active" : ""}`}
                    href={href}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon aria-hidden="true" size={18} strokeWidth={1.8} />
                    <span>{label}</span>
                    {href === "/favorites" && favoriteCount > 0 ? (
                      <span className="favorite-count" aria-label={`${favoriteCount} favoritos`}>
                        {favoriteCount}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>
    </>
  );
}

export function Navbar() {
  return (
    <Suspense fallback={<header className="site-header"><div className="site-header-inner"><Link className="brand" href="/">Wanderlust</Link></div></header>}>
      <NavbarContent />
    </Suspense>
  );
}
