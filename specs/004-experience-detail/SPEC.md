# SPEC — Detalle de experiencia de Wanderlust Explorer

## 1. Objetivo y contexto

Definir los requisitos funcionales y visuales de `/experiences/[id]`, donde la persona usuaria consulta una experiencia del catálogo local, puede guardarla o quitarla de favoritos y descubrir alternativas de la misma categoría. La página sigue la identidad global de [`docs/DESIGN.md`](../../docs/DESIGN.md), los fundamentos de `001-foundation`, la Home de `002-home` y el Explorador de `003-explorer`.

## 2. Alcance y fuera de alcance

**En alcance:** obtener una experiencia por su ID; presentar los datos existentes; permitir favoritos; mostrar hasta tres experiencias relacionadas; reutilizar navegación, pie y tarjeta compartidos; dar acceso de regreso al Explorador; estado de identificador inexistente.

**Fuera de alcance:** modificar `Experience` o el dataset; añadir información no contenida en el registro; nuevas imágenes o galerías; reservas, pagos, fechas, disponibilidad o participantes; mapas, duración, reseñas, testimonios, garantías o datos de guías; persistencia de favoritos; desarrollar Favorites o Profile; instalar dependencias.

## 3. Análisis de los mockups

Referencias: `docs/mockups/detail-desktop.png` (765 × 1600) y `docs/mockups/detail-mobile.png` (224 × 1600). Se consideran en tres niveles:

1. **Diseño general:** página editorial de detalle, con fotografía de gran protagonismo, contenido con jerarquía clara y continuidad visual con Home y Explorer. La versión móvil mantiene el mismo propósito y contenido en una composición vertical.
2. **Secciones principales:** navegación compartida; regreso al catálogo; bloque principal de imagen e información; tarjeta lateral de precio y favoritos en escritorio, integrada en el flujo en móvil; sección de experiencias relacionadas y footer. El detalle conserva foco en una sola experiencia, sin convertir el diseño en un flujo transaccional.
3. **Detalles de componentes:** imagen amplia con recorte apropiado; categoría, título, destino y valoración en una jerarquía editorial; descripción legible; tarjeta blanca diferenciada con precio en euros y acción de favorito; tarjetas relacionadas coherentes con las de Explorer, adaptadas a una cuadrícula responsive.

Los mockups son guía de composición, no fuente de datos ni autorización para incorporar prestaciones, atributos o imágenes no contemplados en esta SPEC. Prevalecen los valores reales del catálogo y `DESIGN.md`.

## 4. Requisitos funcionales

### RF-001 — Ruta dinámica y obtención de datos

- Resolver el ID de la ruta `/experiences/[id]` contra el dataset local compartido y presentar el registro encontrado, sin duplicar catálogo ni alterar `Experience`.
- Respetar la forma asíncrona de `params` de la versión instalada de Next.js.
- Para un ID inexistente, responder mediante `notFound()` y mostrar el estado 404 coherente con la identidad visual, con navegación útil de regreso; no mostrar contenido de otra experiencia ni datos inventados.

### RF-002 — Presentación de la experiencia

Mostrar, desde el registro correspondiente:

- imagen principal usando su `imageUrl` existente;
- título;
- categoría con etiqueta española existente;
- ciudad y país;
- valoración;
- descripción completa;
- precio en euros.

No incorporar fotografías, galerías, citas, testimonios, ampliaciones de texto, atributos ni afirmaciones que no estén en el modelo o registro. La imagen es ilustrativa según su recurso y no autoriza inferencias sobre detalles no incluidos en los datos.

### RF-003 — Precio y favoritos

- Presentar el precio y el control de favoritos dentro de una tarjeta informativa claramente distinguible.
- Reutilizar `FavoritesProvider` y `ExperienceFavoriteButton` siempre que sea posible; no crear un estado local paralelo.
- Permitir guardar y quitar el registro de favoritos. El control comunica los estados **«Guardar en favoritos»** y **«Guardado en favoritos»**, tanto visualmente como mediante nombre accesible/estado semántico.
- Reflejar inmediatamente los cambios compartidos al navegar entre rutas durante la vida actual de la aplicación. No persistir favoritos.

### RF-004 — Experiencias relacionadas

- Incluir la sección **«También te puede interesar»** con hasta tres registros de la misma categoría, excluyendo el actual.
- Elegirlos de forma determinista desde el catálogo, conservando su orden de origen; no inventar criterios de recomendación ni datos.
- Reutilizar `ExperienceCard`. Cada tarjeta permite llegar al detalle correcto y gestionar favoritos mediante el estado compartido.
- Si no hay otros registros coincidentes, no mostrar tarjetas vacías ni inventar alternativas; la sección puede omitirse.

### RF-005 — Navegación compartida

- Reutilizar Navbar y Footer globales; no duplicar sus estructuras ni estado.
- Mostrar un enlace **«Volver a experiencias»** hacia `/experiences` con navegación del lado del cliente.
- En la ruta de detalle, la Navbar debe identificar **Experiencias** como sección activa, respetando el comportamiento compartido existente.

## 5. Requisitos visuales y responsive

- Seguir el carácter editorial de viajes de Home y Explorer, aplicando la paleta y tipografía de `DESIGN.md`: verde bosque `#184E45`, terracota `#E58B5B`, crema `#F8F6F0`, blanco `#FFFFFF`, carbón `#202B28`, salvia `#74837C`; Playfair Display para títulos, Inter para texto y Lucide Icons cuando corresponda.
- Dar protagonismo a la fotografía principal existente, manteniendo su proporción y recorte sin ocultar información esencial.
- En escritorio, presentar el bloque de imagen/información junto a la tarjeta lateral de precio y favoritos, con jerarquía visual clara y lectura natural.
- En móvil, apilar los bloques, manteniendo visibles y utilizables tanto el precio como la acción de favoritos. Evitar desbordamiento horizontal.
- Presentar relacionados en cuadrícula responsive y mantener el orden de lectura en todos los tamaños.
- Garantizar contraste suficiente, tipografía legible, estructura semántica de encabezados, foco visible, navegación por teclado y nombres accesibles para controles iconográficos. No depender solo del color o del icono para comunicar el estado favorito.
- Mantener los estilos y patrones compartidos; esta SPEC no fija breakpoints, medidas ni implementación CSS.

## 6. Reglas de comportamiento

1. El ID determina un único registro del dataset; un ID inválido activa el estado 404.
2. Los campos presentados corresponden al registro exacto y no se sustituyen por contenido editorial añadido.
3. Una experiencia no puede recomendarse a sí misma. Los relacionados pertenecen a su misma categoría y se limitan a tres siguiendo un orden estable del catálogo.
4. La acción de favorito conmuta entre guardar y quitar, utiliza el estado compartido en memoria y no activa navegación accidental.
5. Todos los enlaces internos conservan navegación del lado del cliente; el detalle cuenta como parte de la sección activa «Experiencias».

## 7. Criterios de aceptación verificables

- **CA-001:** al abrir un ID existente, se obtiene el registro correspondiente del dataset y se renderiza el detalle; `params` se trata según el contrato asíncrono de Next.js instalado.
- **CA-002:** el detalle muestra imagen `imageUrl`, título, categoría traducida, ciudad, país, valoración, descripción íntegra y precio formateado en euros, sin datos añadidos.
- **CA-003:** un ID inexistente produce `notFound()`/404 con presentación coherente y un camino accesible de regreso; no muestra otra experiencia.
- **CA-004:** la tarjeta informativa presenta precio y favorito; el control expone «Guardar en favoritos» o «Guardado en favoritos», agrega y quita correctamente, y el estado compartido permanece al navegar sin persistirse.
- **CA-005:** «También te puede interesar» contiene cero a tres experiencias de la misma categoría, excluye el ID actual, y la selección se repite de forma determinista en el orden del catálogo.
- **CA-006:** cada relacionada reutiliza `ExperienceCard`, lleva a su ID correcto y actualiza el proveedor de favoritos; interactuar con favorito no dispara la navegación de la tarjeta.
- **CA-007:** se reutilizan Navbar y Footer; el enlace «Volver a experiencias» conduce a `/experiences` sin recarga completa y la Navbar marca Experiencias como activa en `/experiences/[id]`.
- **CA-008:** escritorio presenta información junto a la tarjeta lateral; móvil apila contenido y tarjeta; los relacionados forman una cuadrícula adaptable y no hay desbordamiento horizontal.
- **CA-009:** teclado, foco visible, contraste, encabezados y nombres/estados accesibles permiten comprender y operar la página sin depender solo de color o iconos.
- **CA-010:** no se introducen reservas, pagos, fechas, disponibilidad, participantes, mapas, duración, reseñas, testimonios, garantías, información de guías, nuevas imágenes, dependencias, cambios al dataset/modelo ni páginas Favorites/Profile.

## 8. Dependencias

- `001-foundation/SPEC.md`: `Experience`, dataset local, categorías y etiquetas, Navbar, proveedor de favoritos e identidad visual.
- `002-home/SPEC.md`: `ExperienceCard`, controles compartidos de favorito y Footer. La proveniencia/licencia de las seis fotografías originales continúa sujeta a la nota de `002-home`; esta fase no agrega ni altera activos.
- `003-explorer/SPEC.md`: patrones de presentación de catálogo, reutilización de tarjetas y sección activa Experiencias para rutas `/experiences/*`.
- Implementación existente: ruta dinámica, `notFound()`, `ExperienceFavoriteButton`, `FavoritesProvider`, `ExperienceCard`, Navbar y Footer. La planificación posterior verificará el estado real de estos componentes y concretará la página sin duplicarlos.

## 9. Decisiones pendientes

1. **Copia del estado 404:** decidir el texto breve y la acción principal exacta, manteniendo `notFound()` y el tono visual compartido; no añadir motivos o detalles del error que no se conozcan.
2. **Posición del enlace de regreso:** confirmar su ubicación visual concreta según mockup y jerarquía de página.
3. **Presentación del rating:** confirmar si basta con el valor numérico y el icono existente o si se conserva otro tratamiento compartido; no añadir reseñas ni número de opiniones.
4. **Formato de precio:** acordar si el detalle conserva el formato de moneda y el sufijo «/ persona» usados por `ExperienceCard`, evitando prometer participantes o servicios no definidos.
5. **Composición exacta del mockup:** fijar en `PLAN.md` proporciones, tamaños, recortes y breakpoints tras inspección visual de alta resolución; los requisitos de escritorio/móvil de esta SPEC son normativos, las dimensiones quedan abiertas.

Estas decisiones no alteran los datos permitidos, el alcance funcional ni los criterios de aceptación anteriores.
