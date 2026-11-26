# PLAN — Página de favoritos de Wanderlust Explorer

## 1. Objetivo

Concretar la estrategia técnica para implementar la SPEC aprobada de `005-favorites`, manteniendo las responsabilidades y contratos de los componentes existentes. El resultado será `/favorites`, integrado con el estado compartido en memoria y con presentación coherente con Explorer, Detail y `docs/DESIGN.md`.

## 2. Estado actual inspeccionado

- `FavoritesProvider` contiene el estado en memoria `favoriteIds`, expone `favoriteCount`, `addFavorite`, `removeFavorite` e `isFavorite` y protege frente a IDs duplicados al añadir.
- El proveedor ya envuelve la aplicación desde `src/app/layout.tsx`; Navbar, rutas y controles consumidores comparten esa instancia. No se necesita otro provider ni una nueva fuente de estado.
- `ExperienceCard` presenta los datos del registro y enlaza a `/experiences/[id]`; ya incluye `ExperienceFavoriteButton` como control de corazón independiente de la navegación al detalle.
- `ExperienceFavoriteButton` conmuta el estado compartido, expone `aria-pressed` y etiqueta contextual accesible. En Cards es compacto, por lo que la página no requiere control de eliminación propio.
- Navbar lee `favoriteCount` y marca «Favoritos» como activo para `/favorites`. Footer ya se renderiza desde el layout raíz.
- La hoja global define `.page-shell`, `.page-title`, `.page-description`, `.experience-grid`, `.explorer-empty`, `.explorer-primary-button` y breakpoints compartidos: tres columnas por defecto, dos bajo `58rem` y una bajo `40rem`.
- La ruta `/favorites` actual es una página cliente con contenido provisional («Tus favoritos», lista textual y acción separada). Se reemplazará su contenido sin tocar las demás páginas ni el estado global.

## 3. Enfoque técnico

### 3.1 Página y datos

Mantener `src/app/favorites/page.tsx` como consumidor cliente de `useFavorites`, ya que el proveedor existente expone el estado mediante Context. Leer el catálogo compartido de `src/data/experiences.ts` y derivar la lista filtrando por IDs favoritos. Para preservar el orden aprobado, recorrer el catálogo en su orden original y seleccionar los registros cuyos IDs están en `favoriteIds`; no ordenar por fecha, título, categoría ni orden de marcado.

Renderizar cada resultado con `ExperienceCard` y una clave estable por `experience.id`. Así, el acceso a detalle, los datos presentados y el corazón quedan delegados a los componentes ya usados por Home y Explorer. No agregar lista mutable local, efectos de sincronización, proveedor local ni botones de eliminación adicionales.

### 3.2 Encabezado y contador

Usar el contenedor `.page-shell` y la jerarquía `.page-title`/`.page-description` existentes. Mostrar «Mis favoritos» y su introducción; ubicar el número junto al encabezado, como se aprobó, y calcularlo desde `favoriteCount` del proveedor (no desde una cifra fija). Redactar la etiqueta en español y asegurar que el número siga siendo perceptible para tecnologías de asistencia. El dato debe reflejar inmediatamente todas las mutaciones del provider.

### 3.3 Estado vacío

Condicionar la vista por el resultado derivado. Si no hay experiencias favoritas, presentar un bloque de estado vacío con estilo basado en `.explorer-empty`, su jerarquía y el botón `.explorer-primary-button`; usar el icono `Heart` de `lucide-react`, texto de título aprobado, mensaje breve y `Link` de Next hacia `/experiences` con etiqueta exacta «Explorar experiencias». El icono se marca decorativo cuando el texto ya comunica el significado. Se reutilizarán clases o ajustes específicos mínimos en `src/app/globals.css`, evitando una nueva variante general o estilos inline.

Si hay experiencias, renderizar `.experience-grid`; no mostrar simultáneamente el estado vacío. Retirar el último corazón provoca una actualización del Context y el render inmediato de este estado, sin redirección ni recarga.

### 3.4 Responsive, accesibilidad y navegación

Reutilizar el sistema global de cuadrícula que ya da tres columnas en escritorio, dos columnas bajo `58rem` y una columna bajo `40rem`. Confirmar que estas dimensiones corresponden a escritorio/tablet/móvil según la aceptación y evitar reglas locales que contradigan Explorer. Mantener los estilos compartidos de focus-visible de enlaces y botones; cualquier nueva acción debe ser un enlace semántico operable por teclado.

No agregar Navbar o Footer a la ruta: ambos ya se montan globalmente. La Navbar conserva estado activo, contador y navegación. Las tarjetas y CTA usan `Link` para navegar sin recargas completas.

## 4. Archivos previstos

### Modificación prevista

- `src/app/favorites/page.tsx` — reemplazar lista provisional por encabezado con contador, derivación de favoritas del catálogo, ExperienceCard y estado vacío.
- `src/app/globals.css` — solo los ajustes mínimos necesarios para alinear encabezado/contador y estado vacío con Explorer, manteniendo la cuadrícula y breakpoints compartidos existentes.

### Componentes existentes que se reutilizan sin cambios previstos

- `src/components/favorites/FavoritesProvider.tsx`
- `src/components/favorites/ExperienceFavoriteButton.tsx`
- `src/components/experiences/ExperienceCard.tsx`
- `src/components/layout/Navbar.tsx`
- `src/components/layout/Footer.tsx`
- `src/app/layout.tsx`
- `src/data/experiences.ts` y `src/types/experience.ts` (solo lectura; no modificar)

Las tareas posteriores pueden confirmar que no haga falta tocar la hoja global si los estilos existentes son suficientes. No se prevén cambios funcionales en páginas ajenas a Favorites.

## 5. Verificación

- Probar estado vacío inicial, adición desde una ruta existente, eliminación de un elemento y eliminación del último favorito.
- Confirmar que contador de encabezado y contador de Navbar provienen del mismo estado y se actualizan al instante.
- Comprobar que las tarjetas son exactamente las favoritas, no hay duplicados y mantienen el orden original del catálogo; verificar cada enlace de detalle y que el corazón no dispara navegación.
- Revisar estado vacío y CTA hacia `/experiences`, ruta activa en Navbar y Footer único global.
- Verificar tres columnas en escritorio, dos en tablet y una en móvil, con teclado, foco visible, accesibilidad del corazón y ausencia de desbordamiento horizontal.
- Ejecutar `npm run lint`, `npx tsc --noEmit`, `npm run build` y `git diff --check`.
- Confirmar que el catálogo/modelo, persistencia, dependencias, otras funcionalidades y rama no cambiaron.

## 6. Riesgos y mitigaciones

- **Divergencia del contador:** derivar el texto del `favoriteCount` existente y no volver a calcular o mantenerlo localmente.
- **Orden no determinista:** filtrar el catálogo en lugar de mapear `favoriteIds`, así se conserva el orden original aunque la secuencia de marcado cambie.
- **Navegación accidental al interactuar con el corazón:** confiar en el botón dedicado de `ExperienceFavoriteButton` que ya está fuera del enlace de imagen en `ExperienceCard`; verificar interacción con teclado y puntero sin modificar la Card salvo que se detecte un defecto real.
- **Regresión de otras rutas:** limitar cambios al archivo Favorites y a reglas de estilo específicas; ejecutar lint, TypeScript y build.
- **Estado vacío inconsistente tras eliminar el último:** derivarlo directamente de la lista filtrada en cada render; no añadir estado explícito ni efectos.

## 7. Restricciones de implementación

Respetar íntegramente `specs/005-favorites/SPEC.md`: no crear mockups, no alterar dataset/modelo, no introducir persistencia ni dependencias, no duplicar componentes/estado, no añadir filtros, paginación ni ordenación configurable y no modificar otras páginas. Los textos de interfaz permanecen en español. No realizar commit ni push ni cambiar de rama.
