# PLAN — Página de inicio de Wanderlust Explorer

## 1. Enfoque

Implementar `/` sobre la base ya existente de Next.js App Router, respetando `docs/DESIGN.md` y los mockups como referencia de jerarquía editorial, no como medidas rígidas. El catálogo `src/data/experiences.ts`, los tipos y categorías de `src/types/experience.ts`, `Navbar` y `FavoritesProvider` serán las únicas fuentes compartidas; no se duplicarán datos ni estado. La Home enviará filtros en URL, pero no implementará filtrado del explorador.

## 2. Arquitectura propuesta

Mantener `src/app/page.tsx` como Server Component y componer secciones pequeñas bajo `src/components/home/`, por ejemplo `HomeHero`, `ExperienceSearch`, `CategorySection` y `FeaturedExperiences`. Mantener `Navbar` en `src/components/layout/Navbar.tsx` y en el layout raíz, con ajustes de estilo puntuales para armonizar con el hero sin crear otra navegación. Añadir `src/components/experiences/ExperienceCard.tsx` como presentación reutilizable y `ExperienceFavoriteButton.tsx` como límite cliente si la interacción se separa de la tarjeta. El footer puede ser un componente pequeño reutilizable en layout si tiene uso común; de otro modo permanece específico de Home. Los nombres/rutas finales se ajustarán a convenciones observadas durante la implementación, evitando fragmentación excesiva.

La Home obtiene y deriva datos en servidor desde el catálogo local. Componentes sin interacción serán Server Components. El buscador de esta fase contiene exclusivamente los selectores de destino y categoría; será un Client Component pequeño que utiliza `useRouter` y `URLSearchParams` para navegar sin recarga, construyendo `/experiences` con `category` y/o `destination` y omitiendo valores vacíos. No habrá campo de búsqueda textual ni se enviará `search`; este parámetro se reserva para `003-explorer`. La tarjeta o su botón de favorito será cliente únicamente para leer y actualizar el `FavoritesProvider` ya montado en el layout. Los enlaces de navegación serán `next/link`.

## 3. Datos, opciones y navegación

- Importar el catálogo compartido; no copiar ni reescribir registros.
- Calcular categorías a partir de `EXPERIENCE_CATEGORIES` y `EXPERIENCE_CATEGORY_LABELS` ya exportados. Para cada valor, contar coincidencias reales del catálogo y mostrar la etiqueta española.
- Derivar destinos únicos a partir de `experience.destination.country`, deduplicar y ordenar de forma determinista. El selector muestra países y, al elegir uno, lo envía en `destination`.
- El selector de categoría envía el valor interno inglés en `category`; las opciones se presentan en español.
- `search` forma parte del contrato acordado con el ejercicio y se enviará solo cuando su campo tenga un valor. La Home no define ni aplica la interpretación del filtro de texto.
- Enviar únicamente parámetros seleccionados, URL-encoded. Sin selecciones, navegar a `/experiences` sin query string. Categorías y tarjetas de categoría enlazan usando `category`; CTA y enlace de catálogo enlazan a `/experiences`.

## 4. Hero y orden editorial

Presentar la Navbar compartida seguida de un hero panorámico con fotografía local de paisaje/destino natural y una capa verde bosque suficiente para legibilidad. Incluir el título exacto «El mundo está lleno de historias por descubrir», una introducción breve en español sin afirmaciones no verificadas y CTA «Explorar experiencias» hacia `/experiences`. Seguir con buscador, categorías, experiencias destacadas, enlace para ver el total del catálogo y footer sencillo, manteniendo en móvil el orden lógico y apilando controles. No convertir el mockup en especificación de dimensiones.

## 5. Selección destacada y ExperienceCard

La selección será una lista constante y determinista de IDs reales, definida en el módulo de Home, con al menos una experiencia por cada categoría. Propuesta inicial, pendiente de comprobar contra el catálogo durante implementación: `adventure-001`, `culture-001`, `food-001`, `wellness-001`, `nature-001` y `adventure-002`. Resolver los IDs contra el catálogo, no mantener objetos copiados. La sexta plaza aporta variedad y no modifica `Experience` ni introduce atributo `featured`.

`ExperienceCard` recibirá un `Experience` y presentará imagen, título, categoría traducida, ciudad, país, valoración y precio formateado en euros mediante `Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" })`. El enlace al título/acción conduce a `/experiences/[id]` con el ID real. El corazón ofrece etiqueta contextual y estado accesible (`aria-pressed`) y conmuta mediante `useFavorites`; no implementa estado local paralelo ni persistencia. Definir una interfaz apta para Home, Explorer y Favorites sin agregar variantes visuales innecesarias; si las fases posteriores precisan diferencias, usar props de presentación acotadas manteniendo el mismo contrato y componente.

## 6. Navbar y favoritos

Reutilizar `Navbar` una única vez desde `src/app/layout.tsx`. Ajustar solo los estilos globales necesarios para que su superficie, alineación y relación con el hero sigan el mockup, preservando los enlaces, ruta activa, `aria-current`, contador y funcionamiento en todas las rutas.

Mantener `FavoritesProvider` existente como fuente única de estado en memoria. `ExperienceFavoriteButton` consumirá `useFavorites` para consultar y alternar el ID. La tarjeta no replica estado ni altera el proveedor; la navegación mantiene estado por estar el proveedor en el layout raíz.

## 7. Recursos fotográficos

Antes de implementación, acordar e incorporar únicamente activos locales con licencia y procedencia documentadas. Se requieren: una panorámica natural para el hero; cinco imágenes representativas de Aventura, Cultura, Gastronomía, Bienestar y Naturaleza; e imágenes para las seis experiencias destacadas, salvo que sus registros apunten ya a activos adecuados. Inspeccionar los activos actuales bajo `public/images/experiences/` y no asumir que el placeholder genérico satisface una representación fotográfica. Mantener rutas locales, optimizar dimensiones/formato y usar `next/image` con tamaños/recortes responsivos cuando corresponda; registrar atribución/licencia en documentación de implementación acordada. No descargar ni generar nada como parte de este plan documental; su incorporación queda condicionada a aprobación previa.

## 8. Diseño responsive y accesibilidad

Tomar desktop y móvil como referencias de composición: protagonismo fotográfico, ritmo de secciones, superficies suaves y tarjetas visuales. Aplicar mobile-first en estilos existentes (`src/app/globals.css` o CSS modular según convención), con controles apilados y táctiles en anchos reducidos, cuadrículas que se adapten progresivamente y sin desbordamiento horizontal. Usar tokens y fuentes existentes; mantener contraste accesible especialmente sobre imágenes, foco visible, labels explícitos, encabezados semánticos, enlaces descriptivos y nombres accesibles para botones de icono. Las imágenes no sustituyen datos textuales.

## 9. Validación

- Revisar los IDs destacados contra el catálogo y verificar que aparecen las cinco categorías; comprobar que los conteos y el total se derivan dinámicamente.
- Validar navegación/formulario para sin filtros, solo `search`, solo categoría, solo país y combinaciones; verificar encoding y ausencia de parámetros vacíos. Confirmar que la Home solo construye URLs y no filtra experiencias.
- Comprobar los datos renderizados de las tarjetas frente al registro y la ruta de detalle; probar favoritos al añadir/quitar y navegar.
- Ejecutar scripts existentes (`npm run lint`, `npm run build`) y la comprobación TypeScript disponible (`npx tsc --noEmit`); no introducir herramientas ni dependencias sin aprobación.
- Revisar visualmente desktop y móvil conforme a mockups, ausencia de overflow, foco/teclado, etiquetas, contraste y carga de recursos locales. Verificar que Navbar se mantiene funcional en rutas existentes.

## 10. Decisiones acordadas y dependencias

Quedan adoptados para esta fase: selección editorial por seis IDs existentes (incluyendo representación de las cinco categorías), país como valor de `destination`, parámetros `search`, `category`, `destination`, categorías internas inglesas con etiquetas españolas, footer breve de marca/descripción/enlaces a rutas existentes, y fotografía local optimizada con licencia adecuada. Los IDs sugeridos son provisionales hasta confirmar presencia y conveniencia en el catálogo. Los recursos fotográficos podrán incorporarse durante implementación solo tras aprobación; el resto de cambios queda sujeto a autorización del usuario antes de comenzar. No se modificará el modelo `Experience`, no se instalarán dependencias, no se implementará filtrado del explorador y no se alterarán otros documentos.