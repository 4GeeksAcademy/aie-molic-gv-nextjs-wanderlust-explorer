# PLAN — Explorador de experiencias de Wanderlust Explorer

## Estado final de auditoría

La implementación de Explorer está presente en `src/components/experiences/Explorer.tsx`, `src/app/experiences/page.tsx` y estilos compartidos. Las tareas deben reflejar únicamente comprobaciones efectivamente realizadas: el usuario comunicó validación visual/funcional de la página de perfil, no una validación manual específica del explorador. La auditoría actual ejecutó lint, TypeScript, build, diff check, verificó HTTP 200 de rutas y revisó URL directa y código; no reemplaza pruebas en navegador de interacción, historial, teclado ni responsive. La procedencia/licencia de seis fotos heredadas sigue sin acreditarse. 32 WebP del catálogo se documentan como imágenes ilustrativas generadas con IA.

## 1. Enfoque y arquitectura

Implementar `/experiences` sobre App Router y el catálogo local existente. La URL será la fuente de verdad de `search`, `category`, `destination` y `page`; no se duplicarán el catálogo ni los favoritos. Se reutilizarán `ExperienceCard`, `FavoritesProvider` y la Navbar existente. Sin nuevas dependencias ni funcionalidades ajenas a la SPEC. El catálogo conserva seis fotografías originales y usa imágenes WebP generadas mediante IA para los 94 registros restantes; estas imágenes son ilustrativas y no representan necesariamente el destino o la actividad exactos.

Estructura propuesta, ajustable a las convenciones existentes sin multiplicar componentes innecesariamente:

```text
src/app/experiences/page.tsx              # entrada del explorador
src/app/page.tsx                          # Home: utiliza el footer compartido
src/components/experiences/                # ExperienceCard existente y controles del explorador
src/components/layout/Footer.tsx          # footer extraído de Home
src/data/experiences.ts                   # catálogo existente; cambiar solo imageUrl para completar imágenes
public/images/experiences/                # seis fotos originales, 32 WebP generados mediante IA y placeholder de respaldo
src/types/experience.ts                  # modelo y etiquetas existentes, sin cambios
```

La página será Server Component por defecto y compondrá un límite cliente para los controles y resultados que deban reaccionar a la URL. Este límite consumirá `useSearchParams`, `usePathname` y `useRouter` de `next/navigation`; se aislará bajo `Suspense` donde lo requiera la versión instalada de Next.js. Las opciones, conteos y resultados se derivarán del catálogo y los parámetros validados, no de una segunda copia del estado. Se verificará la guía instalada de Next.js antes de implementar los límites de navegación.

Extraer el footer actualmente integrado en Home a `Footer` y utilizarlo tanto allí como en el explorador, manteniendo su contenido, apariencia y enlaces. Evitar montarlo dos veces o alterar las demás páginas. Mantener la Navbar y `FavoritesProvider` del layout raíz y la misma `ExperienceCard` con su control de favoritos existente.

## 2. URL, navegación y escritura

- Leer y decodificar los cuatro parámetros desde `useSearchParams` en cada navegación; los valores válidos determinan controles, chips, resultados y página. `URLSearchParams` construirá una URL codificada y canónica con solo parámetros reconocidos y no vacíos; omitir `page` para la primera página.
- Validar `category` y `destination` contra las categorías y países realmente presentes en el catálogo. Tratar un valor ausente, vacío, inválido o duplicado de un parámetro reconocido como ausencia de ese criterio; `search` no vacío es texto literal. Ignorar los parámetros desconocidos. La normalización elimina valores inválidos, duplicados y desconocidos al interactuar, sin obligar a reescribir una URL entrante antes de que haya interacción.
- Aceptar `page` solo como entero decimal positivo y único. Un valor inválido equivale a página 1; si supera la última página con coincidencias, mostrar la última página válida. Sin resultados, el estado vacío prevalece. En la siguiente interacción se serializa la página efectiva y se omite si es 1.
- Cambios de criterios y acciones de limpieza restablecen `page` a 1. Los controles de página actualizan `page` sin cambiar filtros. Los enlaces de Home conservan compatibilidad con los valores ingleses de categoría y el país.
- Usar navegación cliente: `router.replace` para cambios de texto agrupados y `router.push` para filtros, limpieza y páginas, de modo que atrás/adelante restauren entradas significativas. En una navegación de historial se restauran exactamente los criterios y la página válida de la URL; no se confunde esa restauración con un cambio de criterio realizado mediante controles.

**Escritura rápida:** mantener únicamente un borrador temporal controlado del campo de búsqueda, no otro conjunto de filtros ni resultados. Actualizar el input inmediatamente, respetar la composición IME y agrupar la escritura breve antes de sincronizar `search` con `router.replace`; los resultados se recalculan a partir de la URL sincronizada. Cancelar temporizadores pendientes al limpiar, cambiar de ruta o usar atrás/adelante; al usar otro control, incorporar el texto visible más reciente al mismo cambio y volver a página 1. Evitar que confirmaciones de navegaciones anteriores sobrescriban el borrador más reciente: coordinar las actualizaciones pendientes y aplicar la última intención; ante navegación externa prevalece la URL restaurada. Comprobar explícitamente escritura rápida, cambios combinados e historial antes de cerrar esta tarea.

## 3. Datos, búsqueda y filtros

- Derivar categorías presentes y países únicos de `experiences`; presentar sus etiquetas mediante `EXPERIENCE_CATEGORY_LABELS` y mantener los valores internos en inglés. Al completar la cobertura visual, modificar únicamente `imageUrl` en `src/data/experiences.ts`; conservar los demás campos del catálogo.
- Escapar los metacaracteres del texto y construir una expresión regular con indicador `i`; comparar solo contra `title`. Una búsqueda vacía no restringe. Entradas como `[` o `.*` se interpretan literalmente y no deben producir errores.
- Aplicar búsqueda, categoría y país mediante AND; conservar el orden original del dataset. Derivar el total filtrado antes de paginar.
- Mostrar chips para cada criterio válido activo. Eliminar uno modifica solo ese criterio; limpiar todos elimina los tres, restablece controles y página. Normalizar la URL en ambas acciones.

## 4. Resultados, paginación y estado vacío

Dividir los resultados filtrados en páginas de hasta 12, con controles de anterior/siguiente y acceso a páginas disponibles, límites deshabilitados y página actual identificable. Sin filtros, las 100 experiencias producen nueve páginas y cuatro tarjetas en la última. Ante una página fuera de rango, aplicar la regla de la sección 2, sin mostrar un falso estado vacío.

Cuando el total filtrado sea cero, mantener controles y chips visibles y mostrar «No se han encontrado experiencias», una descripción breve y «Limpiar filtros». Esta acción restablece criterios y página sin recarga. Cada resultado se presenta con la tarjeta existente y su `imageUrl`. Las imágenes nuevas son ilustrativas y generadas mediante IA; no deben sugerir que muestran con exactitud la actividad o el destino anunciados. Se conserva el placeholder SVG como recurso de respaldo.

## 5. Presentación y accesibilidad

Seguir los mockups de escritorio, móvil y vacío sin incorporar datos ilustrativos ni funciones fuera de alcance. Reutilizar tokens, Playfair Display, Inter y Lucide ya instalados; mantener el estilo editorial de Home. Cuadrícula de tres columnas en escritorio, dos en intermedio y una en móvil, con controles y paginación adaptables sin desbordamiento. La fotografía del catálogo combina seis recursos originales preexistentes y 32 imágenes WebP generadas mediante IA, reutilizadas entre experiencias afines; las imágenes nuevas son ilustrativas, no una representación exacta de cada experiencia o destino.

Asociar etiquetas a búsqueda y selectores; dar nombres accesibles a acciones de chips y favoritos, foco visible, contraste suficiente y manejo completo por teclado. Identificar semánticamente la página actual y anunciar cambios de resultados de forma proporcionada. Respetar las seis fotografías originales (cuya procedencia/licencia sigue pendiente de documentación en T-201 de `002-home`), las 32 imágenes WebP generadas mediante IA y el placeholder de respaldo.

## 6. Validación

- Con las herramientas disponibles, comprobar búsqueda literal y mayúsculas/minúsculas, entradas especiales, opciones derivadas, filtros independientes y combinados, conteos y orden; no añadir dependencias de pruebas sin autorización.
- Validar entrada directa, encoding de espacios/acentos, Home, parámetros vacíos, inválidos, duplicados y desconocidos; verificar normalización al interactuar, historial atrás/adelante y ausencia de recarga completa.
- Probar escritura rápida, composición IME, cambio de filtro antes de que se sincronice el texto, limpieza inmediata e historial durante una actualización pendiente, confirmando que no se pierde texto ni se aplican criterios obsoletos.
- Verificar página 1 sin `page`, primera/última y límites, nueve páginas sin filtros, restablecimiento al cambiar criterios, parámetros de página inválidos o fuera de rango y cero resultados.
- Comprobar datos y enlaces de `ExperienceCard`, favoritos compartidos sin navegación accidental, conservación de las seis fotografías originales, existencia y formato local de las imágenes IA asignadas, existencia del placeholder de respaldo, footer único y funcionamiento de Navbar y Home.
- Ejecutar `npm run lint`, `npx tsc --noEmit`, `npm run build` y `git diff --check`. Revisar en navegador escritorio, intermedio y móvil, teclado, foco, nombres accesibles, contraste y estado vacío. Registrar cualquier comprobación no disponible sin declararla superada.

### Resultado de auditoría y límites

- Ejecutados en esta auditoría: `npm run lint`, `npx tsc --noEmit`, `npm run build`, `git diff --check`; todos correctos.
- Comprobados adicionalmente: HTTP 200 para `/experiences` y rutas principales/detalle; solicitudes directas a URLs con búsqueda/filtros; 100 `imageUrl` del catálogo resuelven a archivos locales existentes. Son comprobaciones técnicas/estáticas, no una prueba de interacción completa.
- Inspección del código confirma regex escapada case-insensitive, combinación AND, parámetros URL, lectura de URL al render, chips, limpieza, paginación e IME.
- Pendiente de navegador: interacción de escritura y filtros, chips, atrás/adelante, no-recarga, paginación extremo a extremo, accesibilidad por teclado/foco y revisión visual responsive en móvil/intermedio/escritorio.
- Integración del footer: la auditoría confirmó que `src/app/layout.tsx` y `Explorer` renderizaban instancias duplicadas en `/experiences`. Se corrigió eliminando la importación y el render local de `Footer` en Explorer; `RootLayout` conserva la única instancia compartida y el contenido/diseño no se modificaron.
- Activos: 32 WebP son ilustrativos y generados mediante IA, como ya documenta este plan; no representan necesariamente de forma exacta el destino/actividad. Se conservan seis fotografías heredadas cuya procedencia/licencia no está acreditada. No se afirma licencia para ningún grupo sin evidencia.

## 7. Decisiones y límites

Quedan adoptados: búsqueda literal con regex case-insensitive; URL como fuente de verdad de los cuatro parámetros; 12 resultados por página y ausencia de `page` en la primera; normalización al interactuar; footer compartido único desde `RootLayout`; y conservación del placeholder de respaldo. Las 32 imágenes WebP nuevas fueron generadas mediante IA y son ilustrativas; se reutilizan en experiencias temáticamente afines. La procedencia/licencia de las seis fotografías originales preexistentes no está acreditada en esta fase; no se les atribuye una licencia inventada. No se incorporan nuevas dependencias.