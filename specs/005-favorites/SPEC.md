# SPEC — Página de favoritos de Wanderlust Explorer

## 1. Objetivo y contexto

Definir los requisitos funcionales y visuales de `/favorites`, que permite consultar y gestionar las experiencias guardadas durante la sesión actual. La página usará exclusivamente el catálogo local y el estado compartido en memoria establecido por `001-foundation`, y mantendrá la identidad de [`docs/DESIGN.md`](../../docs/DESIGN.md).

Las fases `001-foundation`, `002-home`, `003-explorer` y `004-experience-detail` están completadas. Esta especificación describe comportamiento verificable sin prescribir decisiones de implementación que correspondan a un plan posterior.

## 2. Objetivos

- Presentar las experiencias favoritas vigentes de manera clara y coherente con el resto de la aplicación.
- Permitir llegar desde cada favorita a su detalle y quitarla de favoritos desde su tarjeta.
- Reflejar inmediatamente los cambios en el listado y el contador compartido.
- Ofrecer una acción clara para descubrir experiencias cuando no haya favoritos.

## 3. Alcance y fuera de alcance

### En alcance

- Página `/favorites` con título «Mis favoritos», breve introducción y contador real.
- Presentación únicamente de experiencias marcadas como favoritas mediante `ExperienceCard`.
- Eliminación de favoritos usando el botón compartido de corazón y el estado global existente.
- Estado vacío inicial y estado vacío tras quitar la última experiencia.
- Reutilización de Navbar, Footer, `FavoritesProvider`, `ExperienceCard` y `ExperienceFavoriteButton`.
- Diseño responsive, accesible y en español, alineado con Explorer y `DESIGN.md`.

### Fuera de alcance

- Cambiar el modelo `Experience` o el dataset, o duplicar el catálogo, la tarjeta, el estado o la lógica de favoritos.
- Persistir favoritos en `localStorage`, cookies, bases de datos, APIs o cualquier otro mecanismo; autenticación o cuentas.
- Añadir búsqueda, filtros, ordenación, paginación, agrupaciones o funcionalidades ajenas a la gestión solicitada.
- Modificar el comportamiento de Home, Explorer, Detail u otras páginas.
- Crear mockups o incorporar dependencias.

## 4. Requisitos funcionales

### RF-001 — Título, introducción y contador

- Mostrar el título exacto **«Mis favoritos»** y una introducción breve en español que explique que aquí se reúnen las experiencias guardadas.
- Mostrar el número real de experiencias guardadas en el estado compartido, expresado de forma comprensible en español.
- El número debe corresponder al contenido mostrado y actualizarse inmediatamente al añadir o quitar favoritos desde cualquier página.

### RF-002 — Listado de favoritas

- Mostrar únicamente registros cuyo identificador esté marcado como favorito en el estado compartido actual.
- Obtener los datos de cada experiencia del catálogo local existente, sin copiar ni transformar registros con datos inventados.
- Reutilizar `ExperienceCard` y conservar su presentación de imagen, título, categoría traducida, ciudad, país, valoración, precio y corazón.
- Desde cada tarjeta, permitir acceder al detalle correspondiente mediante el ID real.
- El corazón de cada tarjeta permite quitar la experiencia de favoritos sin activar la navegación al detalle.

### RF-003 — Sincronización de estado

- Utilizar el estado compartido ya establecido por `FavoritesProvider`; no crear una lista local paralela ni una segunda fuente de verdad.
- Las acciones realizadas en Home, Explorer, Detail o Favorites deben reflejarse coherentemente en todas las vistas durante la navegación dentro de la aplicación, sin recarga completa.
- Al quitar una favorita en `/favorites`, retirar su tarjeta y actualizar el contador de forma inmediata, sin refrescar la página.
- El estado se mantiene en memoria durante la navegación, pero no se persiste; tras una recarga o nueva sesión puede comenzar vacío según el contrato de `001-foundation`.

### RF-004 — Estado vacío

Cuando el número de favoritas sea cero, tanto al abrir la ruta sin favoritas como después de eliminar la última, mostrar:

- un icono de corazón de Lucide, decorativo si el texto adyacente expresa el significado;
- el título exacto **«Aún no tienes favoritos»**;
- un mensaje breve en español que invite a descubrir experiencias;
- un botón o enlace con presentación de botón y texto exacto **«Explorar experiencias»**, que navegue a `/experiences`.

El estado vacío sustituye al listado, no muestra tarjetas ni ofrece acciones para quitar favoritos inexistentes.

### RF-005 — Navegación compartida

- Reutilizar Navbar y Footer globales sin duplicar su estructura ni alterar las demás páginas.
- La Navbar identifica Favoritos como la ruta activa y mantiene el contador compartido existente.
- Los enlaces a detalle y explorador usan navegación interna sin recarga completa.

## 5. Requisitos visuales y responsive

- Mantener el carácter editorial, natural y ligeramente premium establecido en `docs/DESIGN.md`, así como la continuidad visual con Home, Explorer y Detail.
- Aplicar la paleta compartida: verde bosque `#184E45`, terracota `#E58B5B`, crema cálido `#F8F6F0`, blanco `#FFFFFF`, carbón `#202B28` y salvia `#74837C`, usando combinaciones con contraste suficiente.
- Usar Playfair Display para títulos, Inter para el texto general y Lucide Icons para iconografía, conforme a la base existente.
- Reutilizar superficies, espaciado, esquinas redondeadas, sombras sutiles y estilos de `ExperienceCard`; no crear una variante visual duplicada.
- El listado utilizará una cuadrícula coherente con Explorer: tres columnas en escritorio, dos en tablet y una en móvil. La adaptación no debe ocultar contenido ni acciones ni causar desbordamiento horizontal.
- El estado vacío tendrá una jerarquía clara y una llamada a la acción identificable, manteniendo el mismo fondo, tipografía, paleta y tratamiento visual de la aplicación.
- Mantener una estructura semántica de encabezados, foco visible, controles utilizables con teclado y nombres accesibles para acciones iconográficas. El control de favorito debe exponer su estado y acción de forma accesible, sin depender solo del color o del icono.

## 6. Reglas de comportamiento

1. El conjunto mostrado se deriva de los IDs de favoritos vigentes y de los registros reales del catálogo; no se muestran experiencias no guardadas.
2. Cada experiencia aparece como máximo una vez. La presentación puede conservar el orden de catálogo para dar un orden estable; no se define ni requiere ordenación configurable.
3. El contador representa las favoritas disponibles en el estado compartido y coincide con el número de tarjetas cuando no está vacío.
4. Quitar una experiencia actualiza sin demora el estado compartido, el listado y el contador. Al quitar la última, se muestra el estado vacío sin navegación ni recarga.
5. Agregar o quitar una favorita desde otra ruta actualiza el contenido de `/favorites` cuando se navega a ella; no hay estado desincronizado específico de la página.
6. La navegación a `/experiences` desde el estado vacío y a `/experiences/[id]` desde una tarjeta conserva el comportamiento compartido de navegación del lado del cliente.
7. No hay persistencia: abandonar el ciclo de vida actual de la aplicación por recarga no restaura los favoritos.

## 7. Criterios de aceptación verificables

- **CA-001:** `/favorites` muestra «Mis favoritos» y una introducción breve en español; con N IDs favoritos válidos, el contador comunica N.
- **CA-002:** con varias favoritas, el listado contiene exactamente una `ExperienceCard` por cada experiencia marcada, ninguna experiencia no marcada y los datos de cada tarjeta corresponden al registro real.
- **CA-003:** las tarjetas reutilizan `ExperienceCard`; el enlace de cada tarjeta abre `/experiences/[id]` con el ID de esa experiencia.
- **CA-004:** al quitar una experiencia mediante el corazón en Favorites, desaparece inmediatamente su tarjeta y disminuye inmediatamente el contador en uno, sin recarga; la acción no navega al detalle.
- **CA-005:** al añadir o quitar favoritos desde Home, Explorer o Detail, la Navbar y la página Favorites reflejan el mismo estado compartido al navegar, sin recarga completa y sin duplicados.
- **CA-006:** con cero favoritas, `/favorites` muestra un corazón Lucide, el título «Aún no tienes favoritos», un mensaje invitando a descubrir experiencias y «Explorar experiencias»; no muestra tarjetas.
- **CA-007:** quitar la última favorita cambia inmediatamente al estado vacío y el botón/enlace «Explorar experiencias» navega a `/experiences`.
- **CA-008:** la ruta utiliza Navbar y Footer compartidos y la Navbar presenta Favoritos como sección activa, sin duplicación de elementos globales.
- **CA-009:** el listado se adapta a tres columnas en escritorio, dos en tablet y una en móvil; la página no tiene desbordamiento horizontal y mantiene visibles contenido y controles.
- **CA-010:** navegación por teclado, foco perceptible, semántica de encabezados, contraste, estado accesible del favorito y nombres de controles permiten operar y comprender la interfaz sin depender del color o de iconos solos.
- **CA-011:** no se usa persistencia; una recarga no restaura desde almacenamiento los favoritos, conforme al contrato en memoria de la fundación.
- **CA-012:** no se modifican dataset ni modelo, no se duplican componentes o estado, no se añaden dependencias y no se incorporan filtros, paginación, autenticación ni cambios funcionales a otras rutas.

## 8. Dependencias

- **`001-foundation/SPEC.md`:** contrato de `Experience`, catálogo local, identidad visual, navegación compartida y estado de favoritos efímero en memoria.
- **`002-home/SPEC.md`:** `ExperienceCard` reutilizable, acción de corazón y navegación a detalle.
- **`003-explorer/SPEC.md`:** estilo de catálogo, cuadrícula responsive, estado accesible de favoritos y controles compartidos.
- **`004-experience-detail/SPEC.md`:** comportamiento del botón y sincronización de favoritos al navegar desde/hacia Detail.
- **Implementación actual:** `src/app/favorites/page.tsx`, `FavoritesProvider`, `ExperienceFavoriteButton`, `ExperienceCard`, Navbar y Footer. La planificación deberá inspeccionar sus contratos reales antes de proponer cambios y respetar las restricciones de esta SPEC.

## 9. Decisiones pendientes para la planificación

- La redacción exacta de la introducción y del mensaje breve del estado vacío, siempre manteniendo en UI los textos normativos indicados y sin añadir afirmaciones de producto no aprobadas.
- La ubicación visual del contador en relación con el encabezado y el listado, siempre visible y coherente con Explorer.
- El tratamiento visual detallado del estado vacío (alineación, tamaño del icono y espacios), que debe integrarse con estilos existentes sin constituir un rediseño ni requerir nuevos mockups.
- El orden de presentación de favoritas: se recomienda preservar el orden del catálogo para una salida determinista; no se permite añadir un control de ordenación.
