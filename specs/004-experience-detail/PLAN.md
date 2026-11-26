# PLAN — Detalle de experiencia de Wanderlust Explorer

## 1. Objetivo

Planificar la implementación de `004-experience-detail/SPEC.md` en `/experiences/[id]`, reutilizando la arquitectura y componentes existentes. Se aplican las decisiones aprobadas: enlace de regreso antes de la fotografía, valoración con estrella terracota y valor, precio localizado sin unidad, tarjeta lateral en escritorio y apilada en móvil, relacionados en orden de catálogo y estado 404 personalizado para el segmento de detalle.

## 2. Estado actual y referencias

La ruta `src/app/experiences/[id]/page.tsx` ya espera `params: Promise<{ id: string }>` y consulta `experiences`; actualmente presenta un subconjunto de campos y llama a `notFound()` si no encuentra ID. El layout raíz proporciona `FavoritesProvider` y `Navbar`. Existen `ExperienceFavoriteButton`, `ExperienceCard`, `Navbar` y `Footer`, además de etiquetas `EXPERIENCE_CATEGORY_LABELS` y estilos globales. Navbar identifica ya como activa Experiencias para rutas `/experiences/*`.

La documentación local instalada de Next.js 16.4.6 confirma que `params` es una promesa que se consume con `await`. La convención `not-found.tsx` representa UI cuando se invoca `notFound()` dentro de su segmento. Por eso, ubicar el estado personalizado en `src/app/experiences/[id]/not-found.tsx` limita su efecto a rutas de detalle y no redefine el 404 global.

La composición acordada replica el mockup validado visualmente por la persona usuaria: regreso alineado a la izquierda encima de la foto; contenido a la izquierda y tarjeta de precio/favorito lateral en escritorio; bloques apilados en móvil; relacionados debajo en cuadrícula adaptativa. No se agregan imágenes ni contenido de mockup que no exista en el modelo.

## 3. Arquitectura propuesta

### Ruta dinámica: `src/app/experiences/[id]/page.tsx`

- Mantener la página como Server Component, sin directiva `use client`.
- Tipar params de acuerdo al contrato Next.js instalado; resolver `const { id } = await params` antes de consultar el catálogo.
- Buscar exactamente por `id` en `experiences`. Si no existe, invocar `notFound()` y no renderizar el resto del detalle.
- Derivar experiencias relacionadas de la misma categoría con `filter`, excluir el ID actual y tomar los primeros tres (`slice(0, 3)`). El array conserva orden determinista del dataset.
- Renderizar contenido de detalle y tarjetas como componentes de presentación simples, preferentemente definidos junto a la ruta si son exclusivos de ella; no crear capas de datos, hooks ni estado duplicados.

### Estructura visual de página

1. Enlace `Link` «Volver a experiencias», antes de la imagen y alineado a la izquierda.
2. Composición principal en dos columnas a partir del ancho de escritorio:
   - **Principal:** imagen existente (`imageUrl`), etiqueta de categoría traducida, título, ciudad/país, estrella terracota con valoración y descripción completa.
   - **Lateral:** tarjeta con precio EUR localizado y `ExperienceFavoriteButton`; no añadir sufijo por persona ni un CTA de reserva.
3. Sección «También te puede interesar» tras el detalle, con cero a tres `ExperienceCard` reutilizadas. La cuadrícula seguirá el sistema de columnas/cards del Explorer y colapsará responsivamente.
4. `Footer` permanece compartido desde la composición existente de la aplicación; la página no lo importa/renderiza en paralelo si ya se presenta globalmente.

La etiqueta de precio se formatea con `Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" })`, consistente con `ExperienceCard` sin agregar unidades. La estrella es decorativa (`aria-hidden`) y el valor numérico permanece como texto accesible.

### Favoritos

- Reutilizar el `FavoritesProvider` establecido en `src/app/layout.tsx` y `ExperienceFavoriteButton` con el ID y título del registro.
- Actualizar solo el componente compartido si fuera indispensable para comunicar literalmente los estados aprobados, preservando `aria-pressed`, el toggle sin navegación accidental y etiquetas contextuales. No implementar estado local, almacenamiento ni persistencia.
- El botón se sitúa dentro de la tarjeta lateral y tiene nombre accesible visible o anunciado equivalente para «Guardar en favoritos»/«Guardado en favoritos».

### Estado 404 de detalle

- Crear `src/app/experiences/[id]/not-found.tsx`, Server Component por defecto, con icono Lucide de brújula/exploración, título «Experiencia no encontrada», descripción aprobada y enlace `Link` «Volver a experiencias».
- Usar estilos/tokens existentes, jerarquía semántica y foco visible. La página usa este archivo al lanzar `notFound()` por ID inexistente; no modificar `src/app/not-found.tsx` global ni intentar tratar errores no relacionados.
- No mostrar ID inválido ni motivo especulativo. La ruta de retorno usa navegación cliente.

## 4. Reutilización y archivos previstos

- **Modificar:** `src/app/experiences/[id]/page.tsx` para presentación completa y relacionados.
- **Crear:** `src/app/experiences/[id]/not-found.tsx` para 404 acotado al segmento.
- **Posible ajuste condicionado:** `src/components/favorites/ExperienceFavoriteButton.tsx` solo si su etiqueta actual no cumple los textos exactos aprobados; conservar API compartida y comportamiento de las otras páginas.
- **Estilos:** preferir clases existentes en `src/app/globals.css`. Si hacen falta reglas nuevas para la composición específica, añadir únicamente clases de detalle allí, sin alterar estilos de Home/Explorer ni introducir dependencias.
- **Solo lectura/reutilización:** `src/data/experiences.ts`, `src/types/experience.ts`, `ExperienceCard`, `FavoritesProvider`, Navbar, Footer y layout. No modificar dataset ni modelo.

## 5. Responsive, accesibilidad y navegación

- Aplicar layout mobile-first: una columna en pantallas estrechas; composición de dos columnas en escritorio con información principal a la izquierda y tarjeta lateral a la derecha. Evitar anchos fijos que provoquen desbordamiento.
- Orden DOM y lectura: regreso, contenido de experiencia, tarjeta de precio/favorito en el flujo móvil, sección relacionada. Imagen con `alt` del título real; no esconder información esencial en recursos gráficos.
- Usar un `h1` para el título del detalle y jerarquía consistente para «También te puede interesar». La página 404 tendrá su propio encabezado de nivel principal.
- Botón favorito operable por teclado, foco visible, nombre accesible contextual y estado `aria-pressed`; no depender de corazón/color solamente. Mantener iconos decorativos fuera del árbol accesible si el valor ya se lee.
- Todos los enlaces internos usan `next/link`; conservar `aria-current` de Navbar que ya se activa para `/experiences/[id]`.
- Verificar contraste de texto y controles sobre las superficies según `DESIGN.md`; no usar salvia como texto pequeño sobre fondo de contraste insuficiente.

## 6. Validación y prevención de regresiones

1. Revisar mediante pruebas manuales/inspección los primeros, intermedios y últimos IDs, así como un ID inexistente; validar que se consulta el registro exacto y `notFound()` devuelve el estado personalizado solo bajo `/experiences/[id]`.
2. Comprobar todos los campos mostrados contra el catálogo; validar traducción de categoría, descripción íntegra, valoración numérica/estrella y precio EUR localizado sin unidad agregada.
3. Probar favorito activo/inactivo, adición y eliminación; navegar a otra ruta y volver para comprobar estado en memoria. Confirmar que ninguna acción sobre el botón redirige accidentalmente.
4. Verificar los relacionados de diferentes categorías: cero/tres seleccionados según orden, exclusión del actual y enlaces/favoritos funcionales de cada `ExperienceCard`.
5. Revisar vista móvil y escritorio, foco de teclado, etiquetas accesibles, contraste, ausencia de desbordamiento y Navbar/Footer únicos.
6. Ejecutar `npm run lint`, `npx tsc --noEmit`, `npm run build` y `git diff --check`. Revisar que no se modificaron datos, modelo, páginas Favorites/Profile, dependencias ni activos.

## 7. Secuencia

Implementar primero la página y el 404 local; integrar únicamente si hace falta el texto del botón compartido; después validar navegación, favoritos, relacionados y visual responsivo. Las tareas ejecutables están desglosadas en `TASKS.md`.
