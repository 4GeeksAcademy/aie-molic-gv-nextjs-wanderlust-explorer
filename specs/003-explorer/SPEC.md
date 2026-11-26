# SPEC — Explorador de experiencias de Wanderlust Explorer

## 1. Objetivo y contexto

Definir la página `/experiences` para descubrir las experiencias del catálogo local mediante búsqueda, filtros y paginación. La interfaz estará en español y seguirá la identidad de [`docs/DESIGN.md`](../../docs/DESIGN.md). Esta fase parte de los fundamentos de `001-foundation` y de la Home de `002-home`; esta especificación no prescribe una implementación técnica.

## 2. Alcance y fuera de alcance

**En alcance:** catálogo, búsqueda por título, filtros por categoría y país, sincronización con la URL, filtros activos, pagaginación, estado vacío y diseño adaptable. Se reutilizan la navegación, el pie, las tarjetas y los favoritos compartidos existentes.

**Fuera de alcance:** duplicar el catálogo o los favoritos; modificar `Experience`; inventar datos o atributos; añadir dependencias; desarrollar otras páginas; incorporar ordenación, mapas, fechas, duración, disponibilidad, reseñas, reservas o pagos. Se mantienen las fotografías y los placeholders existentes.

## 3. Análisis de las referencias visuales

1. **Diseño general:** los mockups de escritorio, móvil y estado vacío presentan un catálogo editorial de viajes, con fondo claro, tipografía expresiva, imágenes protagonistas y jerarquía clara. Mantener coherencia con la Home y `DESIGN.md`, sin trasladar literalmente proporciones ni contenido ficticio.
2. **Secciones principales:** navegación compartida, encabezado del catálogo, búsqueda y filtros, filtros activos, contador, cuadrícula y paginación, seguidos del pie. En móvil se reorganizan los controles y las tarjetas en una columna; todas las funciones siguen disponibles. El estado vacío conserva los filtros y sustituye los resultados por un mensaje y una acción para limpiarlos.
3. **Detalles de componentes:** etiquetas y controles reconocibles, chips eliminables, tarjetas fotográficas con datos y corazón, paginación con página activa y controles de avance, y estado vacío centrado con icono y llamada a la acción. Los datos, cifras, enlaces, fotografías y afirmaciones de los mockups son ilustrativos: prevalecen el catálogo y las funcionalidades reales.

## 4. Requisitos funcionales

### RF-001 — Catálogo de experiencias

- Utilizar el dataset local compartido de 100 experiencias. Sin criterios activos, el conjunto de resultados comprende todo el catálogo, distribuido en páginas.
- Reutilizar `ExperienceCard` para presentar la imagen o placeholder, título, categoría traducida, ciudad, país, valoración y precio del registro real. Acceder al detalle mediante su ID y usar el proveedor compartido de favoritos; el corazón no navega al detalle.

### RF-002 — Búsqueda

- Ofrecer búsqueda por título, actualizada al cambiar el término sin recargar la página. Un término vacío no restringe resultados.
- Utilizar una expresión regular sin distinción de mayúsculas/minúsculas. Para evitar patrones inválidos y resultados inesperados, tratar los caracteres especiales introducidos como texto literal mediante su escape; esta interpretación queda sujeta a la confirmación de la sección 9.

### RF-003 — Filtros

- Ofrecer filtros independientes de categoría y destino. El destino es el país de `destination.country`; obtener las opciones únicas de países y categorías del dataset.
- Mostrar categorías en español, conservando en los datos y la URL sus valores internos `Adventure`, `Culture`, `Food`, `Wellness` y `Nature`.
- Combinar los criterios activos entre sí y con la búsqueda mediante AND. La ausencia de selección no restringe resultados.

### RF-004 — Sincronización con la URL

- La URL es la fuente de verdad de búsqueda y filtros mediante `search`, `category` y `destination`; por ejemplo, `/experiences?search=kayak&category=Adventure&destination=Marruecos`.
- Al abrir un enlace directo, rellenar controles y aplicar sus criterios desde la carga inicial. Al cambiar o limpiar criterios, actualizar URL, controles y resultados sin recarga completa; omitir parámetros vacíos y codificar correctamente los valores.
- Los enlaces de Home con `category` y/o `destination` deben funcionar sin transformación de sus valores.
- Un valor de categoría o país que no exista en el catálogo se ignora como filtro y no se presenta como selección o chip válido; los parámetros desconocidos no deben provocar errores ni afectar a los resultados. La política de normalización de la URL queda pendiente de la sección 9.
- Atrás y adelante restauran los criterios de la URL y mantienen controles, chips y resultados coherentes.

### RF-005 — Filtros activos

- Mostrar un chip por cada criterio activo de búsqueda, categoría y destino, identificando su valor de forma legible.
- Permitir eliminar cada criterio por separado y limpiar todos mediante una acción identificable; actualizar controles, URL y resultados sin recarga. No mostrar chips de valores inválidos ignorados.

### RF-006 — Resultados y paginación

- Mostrar el número total de coincidencias tras aplicar búsqueda y filtros, no solo el número de tarjetas visibles.
- Aplicar primero los criterios y después paginar en grupos de 12 experiencias como máximo. Mantener el orden existente del dataset, sin añadir ordenación.
- Permitir acceder a las páginas disponibles, identificar la página actual y evitar avanzar fuera de los límites. Con 100 resultados sin filtrar hay nueve páginas: ocho de 12 y una de cuatro.
- Al cambiar cualquier criterio, regresar a la primera página. Si la página seleccionada deja de existir mientras hay coincidencias, mostrar una página válida con resultados. La representación de la página en URL queda pendiente de la sección 9.

### RF-007 — Estado vacío

- Sin coincidencias, mantener visibles búsqueda y filtros; mostrar exactamente «No se han encontrado experiencias», una descripción breve y el botón «Limpiar filtros».
- Limpiar restablece los criterios y vuelve a mostrar el catálogo desde la primera página. La composición tomará como referencia el mockup del estado vacío, sin datos ni enlaces inventados.

## 5. Requisitos visuales y responsive

- Mantener la estética editorial de la Home, la paleta de `DESIGN.md` (bosque `#184E45`, terracota `#E58B5B`, crema `#F8F6F0`, blanco `#FFFFFF`, carbón `#202B28` y salvia `#74837C`), Playfair Display, Inter y Lucide Icons. Usar combinaciones de contraste accesible.
- Reutilizar la Navbar compartida, el footer de la Home y `ExperienceCard`, sin variantes desconectadas. El footer actual está integrado en la Home: su reutilización requiere compartirlo sin duplicar su contenido ni añadir destinos ficticios.
- Mostrar tres columnas de tarjetas en escritorio, dos en tamaños intermedios y una en móvil. Adaptar controles, chips y paginación al espacio disponible sin desbordamiento horizontal ni pérdida de funciones.
- Garantizar controles con etiquetas asociadas, nombres accesibles para iconos, foco visible, navegación por teclado, jerarquía semántica y contraste adecuado. El estado de favoritos y la página actual deben comunicarse también semánticamente.

## 6. Reglas de comportamiento

1. La URL determina los criterios activos; el estado visible y los resultados deben reflejarla también tras navegación por historial.
2. Buscar solo en el título, sin distinguir mayúsculas/minúsculas y tratando literalmente caracteres especiales; una entrada vacía no filtra.
3. Una experiencia coincide si satisface simultáneamente todos los criterios válidos activos. Los conteos se derivan de las coincidencias antes de paginar.
4. Eliminar un chip elimina solo su criterio; limpiar todos elimina los tres criterios y restablece los controles. Cada cambio de criterios vuelve a la primera página.
5. Si no existen coincidencias se muestra el estado vacío; no debe confundirse una página fuera de rango con ausencia de coincidencias.
6. La interacción con favoritos usa el estado compartido en memoria, sin duplicados ni persistencia, y no activa la navegación al detalle.

## 7. Criterios de aceptación verificables

- **CA-001:** sin filtros, el total coincide con los 100 registros reales; la primera página muestra 12 tarjetas y la última cuatro, sin omisiones ni duplicados entre páginas.
- **CA-002:** cada tarjeta reutilizada muestra los datos y la imagen del registro correspondiente; su enlace lleva al detalle correcto y el corazón añade o elimina el favorito compartido sin navegar.
- **CA-003:** la búsqueda por título actualiza resultados sin recarga y no distingue mayúsculas/minúsculas; una cadena vacía no filtra y entradas como `[` o `.*` no causan errores y se tratan literalmente.
- **CA-004:** opciones de categoría y país proceden del dataset; las etiquetas son españolas y los valores internos de categoría permanecen en inglés. Cada filtro funciona solo y junto a los demás con AND.
- **CA-005:** una URL directa con cualquiera de los tres parámetros o sus combinaciones rellena los controles y aplica los resultados correctos; valores con espacios o acentos se codifican y recuperan correctamente.
- **CA-006:** cambiar o limpiar criterios actualiza URL, controles, chips y resultados sin recarga, sin parámetros vacíos; atrás/adelante restauran criterios y resultados coherentes. Los enlaces de Home funcionan.
- **CA-007:** categoría o país inexistentes y parámetros desconocidos no provocan errores ni aplican filtros inválidos; no aparecen chips inválidos.
- **CA-008:** cada chip elimina únicamente su criterio y «Limpiar filtros» elimina todos; el contador refleja el total filtrado, no solo las tarjetas visibles.
- **CA-009:** la paginación se aplica después del filtrado, muestra hasta 12 tarjetas, identifica la página actual y vuelve a la primera al cambiar criterios; nunca deja una página vacía si existen coincidencias anteriores.
- **CA-010:** sin coincidencias aparecen el mensaje exacto, descripción y botón «Limpiar filtros», con controles todavía visibles; al limpiar se recupera el catálogo.
- **CA-011:** escritorio, tamaño intermedio y móvil presentan respectivamente tres, dos y una columna, conservando funciones, navegación compartida, footer, accesibilidad y ausencia de desbordamiento horizontal.
- **CA-012:** se respetan identidad, contraste, foco visible, etiquetas y nombres accesibles; los controles y la paginación funcionan con teclado.

## 8. Dependencias

- `001-foundation`: modelo `Experience`, catálogo local, categorías, etiquetas, Navbar y proveedor de favoritos.
- `002-home`: `ExperienceCard`, enlaces con parámetros `category` y `destination`, estilos y footer actual. La procedencia y licencia de fotografías siguen pendientes de documentación en T-201; esta fase no incorpora ni sustituye activos.
- Las rutas de detalle y favoritos existentes se reutilizan sin desarrollar sus páginas en esta fase.

## 9. Decisiones pendientes

1. **Búsqueda literal:** confirmar que los metacaracteres se interpreten literalmente mediante escape, manteniendo el uso obligatorio de una expresión regular case-insensitive, en lugar de admitir sintaxis de patrones introducida por la persona usuaria.
2. **Paginación e historial:** decidir en la planificación si la página actual se representa en la URL o en estado de interfaz, sin alterar los contratos de `search`, `category` y `destination`; debe respetar reinicio, límites e historial de criterios.
3. **URL inválida:** acordar si los parámetros inválidos o desconocidos se conservan o se normalizan al interactuar; nunca deben causar errores ni filtros incorrectos.
4. **Footer compartido:** concretar en planificación cómo reutilizar el footer actualmente integrado en la Home, sin duplicación ni cambios de comportamiento ajenos al alcance.
5. **Fotografías:** documentar procedencia, atribuciones y licencias pendientes de los recursos existentes; no incorporar ni generar nuevos activos en esta fase documental.