# Plan — 006 Perfil simulado

## Estado

Fase implementada y validada. T-601, T-602 y T-603 están completadas; la SPEC y los criterios de aceptación se consideran cerrados.

## Objetivo

Ofrecer `/profile` como una página de perfil ficticio coherente con Wanderlust Explorer, que destaque los favoritos reales y facilite la navegación al catálogo.

## Referencias y decisiones

- `specs/006-profile/SPEC.md` — requisitos y criterios aprobados.
- `docs/DESIGN.md` — estética editorial, paleta bosque/crema/terracota, tipografías Playfair Display e Inter, Lucide, enfoque mobile-first y accesibilidad.
- Se usa un avatar de iniciales, datos personales estáticos ficticios y una composición de tarjetas responsive.
- La página consume el `favoriteCount` compartido de `FavoritesProvider`; no altera ni duplica su lógica.
- El layout global mantiene Navbar, `<main>` y Footer; Navbar marca Perfil como ruta activa.

## Implementación final

- `src/app/profile/page.tsx`: encabezado, perfil ficticio, resumen dinámico y enlaces a `/favorites` y `/experiences`.
- `src/app/profile/profile.module.css`: estilos encapsulados para avatar, tarjetas, contador, acciones, foco visible y layouts responsive. En escritorio usa dos columnas; en móvil apila las secciones.
- `next.config.ts`: la regla Tailwind de `*.css` excluye `*.module.css` mediante una condición de ruta. Así el loader `@tailwindcss/turbopack` no convierte el CSS Module en CSS global y Next.js puede generar clases locales.
- `src/app/globals.css`: conserva los estilos compartidos; no contiene reglas específicas del perfil.

## Causa raíz y resolución del problema visual

La regla Turbopack de `*.css` aplicaba el loader Tailwind también a `profile.module.css` y lo emitía como CSS global. Aunque el stylesheet respondía, el HTML renderizado no incluía las clases locales generadas, por lo que selectores como `.avatar` no podían coincidir con el elemento. Se resolvió excluyendo los archivos `.module.css` de esa regla para restaurar el procesamiento nativo de CSS Modules.

## Archivos de implementación

- `src/app/profile/page.tsx`
- `src/app/profile/profile.module.css`
- `next.config.ts`
- `src/app/globals.css` (se retiraron reglas antiguas de perfil que ya no correspondían)

No se modificaron `FavoritesProvider`, el modelo/dataset `Experience`, dependencias, ni funcionalidades de otras páginas.

## Validación y cierre

- `npm run lint` — correcto.
- `npx tsc --noEmit` — correcto.
- `npm run build` — correcto; `/profile` se generó correctamente.
- `git diff --check` — correcto.
- Se inspeccionó el HTML servido y se verificó que las 15 clases locales del perfil tienen selectores coincidentes en el CSS servido, incluyendo reglas responsive.
- El usuario confirmó validación visual y funcional correcta de la página. Se revisaron el perfil, contador de favoritos y actualización, estado cero y navegación; T-603 se cierra tras esta aprobación.
