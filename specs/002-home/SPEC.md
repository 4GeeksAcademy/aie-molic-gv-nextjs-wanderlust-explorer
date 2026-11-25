# SPEC — Página de inicio de Wanderlust Explorer

## 1. Objetivo y contexto

Definir los requisitos de la página `/` para orientar a las personas usuarias hacia el catálogo de experiencias y presentar una selección del contenido disponible. La interfaz estará en español y seguirá la identidad global de [`docs/DESIGN.md`](../../docs/DESIGN.md).

La fase `001-foundation` aporta el tipo `Experience`, el catálogo local de 100 registros, las categorías internas y su traducción, la Navbar compartida y el estado en memoria de favoritos. Esta especificación define el comportamiento y la presentación del inicio; no prescribe su implementación técnica.

## 2. Alcance y fuera de alcance

### En alcance

- Adaptar visualmente la Navbar existente y completar la página de inicio con hero, buscador, categorías, seis experiencias destacadas y footer.
- Obtener destinos, categorías, conteos y experiencias únicamente del dataset compartido.
- Navegar al explorador con parámetros de destino y/o categoría.
- Proponer un componente reutilizable `ExperienceCard` para inicio, explorador y favoritos, con acceso al detalle y acción de favorito.
- Identificar los recursos fotográficos requeridos para su provisión posterior.

### Fuera de alcance

- Implementar la lógica de búsqueda, filtrado u ordenación en `/experiences` (corresponde a `003-explorer`). El inicio solo construye la URL de destino.
- Duplicar el catálogo o crear registros, valoraciones, precios, destinos o reseñas ficticios.
- Cambiar `Experience` sin justificación aprobada; fechas, reservas, pagos, autenticación, cuentas reales o nuevas funcionalidades de perfil.
- Descargar o generar fotografías en esta fase.
- Cambiar el estado compartido o añadir persistencia de favoritos.

## 3. Análisis de referencias visuales

Se consideran las dos referencias suministradas: `docs/mockups/home-desktop.png` (1600 × 6447) y `docs/mockups/home-mobile.png` (487 × 4157). Se deben leer en tres niveles, sin convertir sus proporciones en medidas rígidas:

1. **Diseño general:** página editorial de viajes, con jerarquía marcada, protagonismo fotográfico y adaptación de una misma experiencia entre escritorio y móvil. La página debe mantener un ritmo de secciones reconocible y conducir desde el descubrimiento inicial hasta el catálogo.
2. **Secciones principales:** Navbar, hero con propuesta de valor y llamada a la acción, búsqueda, categorías, experiencias destacadas y pie. En tamaños estrechos, conservar el orden y propósito de las secciones, reorganizando o apilando los controles y tarjetas para lectura y uso táctil.
3. **Detalles de componentes:** tratamientos fotográficos con texto legible, superficies y tarjetas de esquinas suaves, llamadas a la acción distinguibles, controles de selección claros, categorías visuales y tarjetas que presentan información resumida de cada experiencia. La concreción de espaciado, recortes y disposición debe seguir las referencias y la identidad global, sin exigir coordenadas o dimensiones exactas.

Las imágenes son referencias de composición y estilo, no una fuente de datos. Ante cualquier diferencia, prevalecen el modelo y las funcionalidades reales del proyecto y la paleta/criterios de `DESIGN.md`.

## 4. Requisitos funcionales

### RF-001 — Navegación compartida

- Reutilizar la Navbar global ya existente; no crear una segunda navegación exclusiva del inicio.
- Adaptar su presentación para que armonice con el encabezado de los mockups y la composición del hero, conservando la navegación e indicador de ruta activa actuales.
- Mantener los enlaces **Inicio**, **Experiencias**, **Favoritos** y **Perfil**, incluida la semántica accesible de ruta actual.

### RF-002 — Hero

- Presentar una fotografía panorámica de un destino natural como imagen principal.
- Aplicar una superposición en tonos verde bosque suficiente para que el texto y los controles superpuestos sean legibles.
- Mostrar exactamente el título: **«El mundo está lleno de historias por descubrir»**. Se admite puntuación final según el tratamiento tipográfico, sin cambiar el texto.
- Incluir una descripción introductoria breve, en español, coherente con descubrir experiencias auténticas; no añadir afirmaciones factuales no sustentadas.
- El botón **«Explorar experiencias»** navega a `/experiences`.

### RF-003 — Buscador

- Presentar un selector de destino, un selector de categoría y un botón para explorar.
- Construir las opciones a partir del catálogo existente. Los destinos representan las ciudades/países disponibles, sin destinos añadidos manualmente; las categorías visibles son las cinco categorías admitidas, traducidas al español.
- Al enviar, navegar a `/experiences` e incluir los query parameters correspondientes a los valores elegidos. El parámetro de categoría usa el valor interno establecido (`Adventure`, `Culture`, `Food`, `Wellness` o `Nature`), no la etiqueta traducida. El valor de destino corresponde a un destino del dataset y se codifica como parámetro de URL.
- Un campo sin selección no impone filtro ni añade un parámetro vacío; con ambos campos vacíos, el envío equivale a navegar a `/experiences`.
- Esta fase no define ni implementa cómo el explorador interpreta, valida o aplica esos parámetros.

### RF-004 — Categorías

- Mostrar las cinco categorías disponibles, con estas etiquetas: Aventura, Cultura, Gastronomía, Bienestar y Naturaleza.
- Acompañar cada categoría con fotografía representativa. El activo debe corresponder al tema indicado; su origen y licencia deberán resolverse antes de incorporarlo.
- Calcular dinámicamente el número de experiencias por categoría a partir del dataset, nunca mediante cifras escritas manualmente.
- Cada categoría permite navegar a `/experiences` con el parámetro de categoría seleccionado, usando su valor interno.

### RF-005 — Experiencias destacadas

- Mostrar seis experiencias que existan en el catálogo compartido. La selección será determinista y procederá del dataset; no se crearán datos adicionales. La regla editorial exacta de selección queda pendiente de decisión (sección 9).
- Definir para la planificación e implementación un componente reutilizable `ExperienceCard`, apto para inicio, explorador y favoritos.
- Cada tarjeta mostrará fotografía, título, categoría traducida, ciudad, país, valoración y precio en euros, tomando todos los valores de la experiencia correspondiente.
- El título o acción equivalente permite acceder a `/experiences/[id]` con el identificador real.
- Incorporar un control de corazón interactivo ligado al proveedor compartido de favoritos. Debe comunicar su estado y permitir añadir/quitar la experiencia sin duplicar estado ni persistirlo.
- Incluir un enlace para ver las **100 experiencias** que lleva a `/experiences`. La cifra deberá corresponder al total real del catálogo.

### RF-006 — Footer

- Incluir un pie de página sencillo, coherente con la identidad visual y el tratamiento del mockup.
- No introducir enlaces a servicios inexistentes, información corporativa ficticia ni funcionalidades fuera del alcance.

## 5. Requisitos visuales y responsive

- Mantener la composición, jerarquía y carácter editorial de las referencias, adaptando contenido y controles al comportamiento real de la aplicación.
- Aplicar los tokens de `docs/DESIGN.md`: verde bosque `#184E45`, terracota `#E58B5B`, crema cálido `#F8F6F0`, blanco `#FFFFFF`, carbón `#202B28` y salvia `#74837C`, respetando usos y contraste. Para texto pequeño, usar combinaciones que alcancen contraste accesible; no asumir que todos los colores de marca sirven como texto sobre cualquier fondo.
- Utilizar Playfair Display en títulos e Inter en texto general, y Lucide Icons para iconografía, conforme a la base existente.
- Adoptar crema cálido como fondo principal. Las imágenes enriquecen el diseño pero no sustituyen la información textual.
- Diseñar mobile-first: conservar orden y jerarquía de contenido, reorganizar controles y cuadrículas según el espacio y asegurar controles cómodos al tacto, sin fijar breakpoints ni dimensiones en esta SPEC.
- En escritorio, aprovechar el ancho para una presentación editorial y agrupación visual; en móvil, evitar desbordamiento horizontal y mantener legibles títulos, datos y acciones.
- Asegurar foco visible, nombres accesibles para controles de icono, etiquetas asociadas a selectores, estructura semántica de encabezados y contraste suficiente.

## 6. Comportamiento interactivo

- Todos los enlaces y controles deben funcionar con teclado y presentar foco perceptible.
- El selector de destino distingue una opción inicial sin filtro de destinos reales; el selector de categoría distingue igualmente ausencia de selección.
- El botón de búsqueda respeta los valores elegidos y forma la ruta con parámetros URL codificados. No se promete que los resultados ya estén filtrados antes de la fase del explorador.
- Las tarjetas navegan al detalle de la experiencia que representan.
- El corazón refleja el estado compartido en memoria y conmuta entre añadir y quitar favorito; debe exponer estado accesible (por ejemplo, `aria-pressed`) y etiqueta contextual.
- Las tarjetas de categoría navegan al explorador con la categoría seleccionada.
- Las acciones no deben depender exclusivamente del color o de iconos sin nombre accesible.

## 7. Criterios de aceptación verificables

- **CA-001:** `/` muestra una sola Navbar compartida, con los cuatro enlaces requeridos y el indicador activo de Inicio, conservando su funcionamiento en las demás rutas.
- **CA-002:** El hero contiene la fotografía panorámica, superposición verde de legibilidad, título especificado, introducción y CTA que navega a `/experiences`.
- **CA-003:** El buscador obtiene destinos/categorías del dataset; puede enviar destino, categoría, ambos o ninguno, y genera `/experiences` con solo los parámetros aplicables. La categoría enviada es su valor interno, no su traducción.
- **CA-004:** Se muestran las cinco categorías con etiquetas españolas, imagen representativa y conteo que coincide con el número de entradas del dataset para cada valor interno.
- **CA-005:** Cada categoría enlaza al explorador con su parámetro de categoría correcto.
- **CA-006:** Se muestran seis experiencias reales del catálogo y toda la información de cada tarjeta coincide con el registro, incluida categoría traducida, destino, valoración y precio.
- **CA-007:** Existe la definición de `ExperienceCard` reutilizable en las fases pertinentes; desde cada tarjeta se llega al detalle correcto y el corazón actualiza los favoritos compartidos sin duplicados ni persistencia.
- **CA-008:** El enlace de ver todas las experiencias lleva a `/experiences` y la cifra mostrada coincide con el total del dataset (100 en la base actual).
- **CA-009:** El footer aparece al final del contenido y no contiene información o destinos de navegación ficticios.
- **CA-010:** En viewport móvil y escritorio, las secciones siguen una jerarquía coherente con los mockups; no hay desbordamiento horizontal y controles, texto, foco y acciones permanecen utilizables y legibles.
- **CA-011:** Los colores, tipografías e iconos respetan `docs/DESIGN.md`; las combinaciones de texto y fondo mantienen contraste adecuado y los controles tienen etiquetas accesibles.
- **CA-012:** Las fotografías adicionales requeridas están identificadas, pero esta fase documental no las descarga ni genera.

## 8. Dependencias con otras especificaciones

- Depende de `001-foundation/SPEC.md`: modelo `Experience`, catálogo de 100, campos de destino/valoración/precio/imagen, categorías, etiquetas, Navbar, identidad visual y proveedor de favoritos.
- Se apoya en los componentes existentes de navegación y favoritos. La planificación deberá comprobar la estructura real antes de proponer cambios.
- `/experiences` y su interpretación de parámetros se especifican en `003-explorer`; esta página solo envía parámetros compatibles, sin anticipar el algoritmo de filtrado.
- Las tarjetas detalladas o patrones de presentación requeridos por explorador y favoritos deberán reutilizar `ExperienceCard` o acordar expresamente una interfaz compatible, no crear una segunda variante desconectada.
- Los detalles individuales continúan dependiendo de la ruta `/experiences/[id]` ya prevista por la fundación.

## 9. Decisiones pendientes

1. **Selección de las seis destacadas:** definir si será una lista explícita de IDs del dataset, una regla derivada (por ejemplo, valoración) u otra selección editorial reproducible. No inventar un atributo `featured` en `Experience` sin justificación y aprobación.
2. **Destino y query parameter:** acordar el nombre exacto del parámetro y la representación de destino en URL (ciudad o ciudad-país). Debe ser estable y conservar correspondencia inequívoca con el catálogo.
3. **Nombres de parámetros:** acordar el nombre exacto del parámetro de categoría y de destino con `003-explorer`, manteniendo los valores internos actuales de categoría.
4. **Activos fotográficos:** determinar selección, atribución/licencia y nombres/rutas para la imagen panorámica y fotografías de categorías/experiencias. La fundación contiene un placeholder local, no el conjunto fotográfico representativo requerido.
5. **Descripción introductoria y contenido del footer:** validar el texto final y decidir si el pie contiene solo marca/crédito o enlaces existentes; mantenerlo mínimo y no ficticio.

Hasta resolver estas decisiones, son requisitos firmes el origen real de datos, las rutas objetivo, los valores internos de categoría y la necesidad de recursos visuales, no sus convenciones técnicas exactas.
