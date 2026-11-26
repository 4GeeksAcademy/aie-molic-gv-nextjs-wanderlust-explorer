# Tasks — 006 Perfil simulado

Fase cerrada tras implementación, validaciones técnicas y aprobación visual/funcional del usuario.

- [x] **T-601 — Construir la página y la tarjeta de perfil simulado.**
  - **Trabajo:** reemplazar el contenido provisional de `/profile` por el encabezado «Mi perfil», una introducción breve y una tarjeta limpia y elegante con avatar de iniciales o icono Lucide, nombre y correo ficticios y descripción relacionada con viajes. Reutilizar estructura y estilos compartidos donde sea posible; usar contenido semántico y en español.
  - **Archivos afectados:** `src/app/profile/page.tsx` y `src/app/profile/profile.module.css`.
  - **Dependencias:** SPEC y PLAN aprobados; sin dependencia de otras tareas de implementación.
  - **Criterios asociados:** CA-01 y CA-06 (encabezado, datos simulados, semántica, base responsive y accesibilidad visual).

- [x] **T-602 — Integrar el resumen dinámico de favoritos, los enlaces de navegación y el diseño responsive.**
  - **Trabajo:** consumir `favoriteCount` de `useFavorites()` sin estado duplicado; dar protagonismo al total incluso con cero; añadir «Ver mis favoritos» a `/favorites` y la llamada a la acción hacia `/experiences`; ajustar la composición para móvil y escritorio reutilizando tokens globales y estilos encapsulados en CSS Module. No modificar `FavoritesProvider`.
  - **Archivos afectados:** `src/app/profile/page.tsx`, `src/app/profile/profile.module.css` y `next.config.ts` para asegurar el procesamiento correcto de CSS Modules por Turbopack.
  - **Dependencias:** T-601 completada; `FavoritesProvider` existente como contrato de lectura, sin modificaciones.
  - **Criterios asociados:** CA-02, CA-03, CA-04, CA-05 y CA-06 (conteo cero y actualizado, destinos de enlaces, layout global, responsive, teclado y ausencia de overflow).

- [x] **T-603 — Validar los criterios de aceptación y comprobar que no existen regresiones en las páginas anteriores.**
  - **Trabajo:** verificar todos los criterios de la SPEC; probar visual y funcionalmente los conteos cero y actualizado, destinos de navegación y comportamiento responsive/accesible; ejecutar las comprobaciones disponibles y revisar páginas existentes para detectar regresiones. Confirmar que no se introdujeron autenticación, edición, persistencia, dependencias ni cambios fuera de alcance.
  - **Archivos afectados:** ninguno durante la validación; no se requirieron cambios de corrección.
  - **Dependencias:** T-601 y T-602 completadas.
  - **Criterios asociados:** CA-01 a CA-07.
  - **Validaciones técnicas:** `npm run lint`, `npx tsc --noEmit`, `npm run build` y `git diff --check` completados correctamente.
  - **Validaciones de estilos:** se comprobó que el HTML incluye las 15 clases locales generadas y que cada clase tiene su selector correspondiente en el CSS servido, incluidas las reglas responsive.
  - **Causa y resolución:** la regla `*.css` de Turbopack aplicaba el loader Tailwind a `profile.module.css`, convirtiéndolo en CSS global. El HTML quedaba sin clases locales aunque la hoja respondiera correctamente. En `next.config.ts`, la regla ahora excluye los paths `*.module.css`, permitiendo el tratamiento nativo del CSS Module.
  - **Validación manual:** el usuario confirmó que revisó visual y funcionalmente la página y que el resultado es correcto, incluyendo el diseño y funcionamiento acordados. T-603 queda completada; fase 006-profile cerrada.
