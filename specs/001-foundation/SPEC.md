# SPEC — Fundamentos compartidos de Wanderlust Explorer

## 1. Objetivo

Establecer los requisitos funcionales y no funcionales de los fundamentos compartidos de Wanderlust Explorer: modelo de experiencias, catálogo local, identidad visual, estructura de navegación y gestión compartida de favoritos. Esta especificación será la referencia para la planificación técnica posterior y no prescribe una solución de implementación concreta.

## 2. Contexto

Wanderlust Explorer es una aplicación web para descubrir experiencias turísticas. El repositorio ya está inicializado con Next.js App Router, React y TypeScript. La identidad visual global está definida en [`docs/DESIGN.md`](../../docs/DESIGN.md) y deberá respetarse.

La aplicación tendrá interfaz en español. Los nombres técnicos, identificadores internos y valores de categoría del modelo se mantendrán en inglés. Las páginas previstas son `/`, `/experiences`, `/experiences/[id]`, `/favorites` y `/profile`.

## 3. Alcance

Esta fase define requisitos para:

- Un modelo TypeScript común `Experience`.
- Un catálogo local de exactamente 100 experiencias tipadas.
- La aplicación coherente de la identidad visual global.
- Una estructura de navegación común para las cinco rutas previstas.
- La gestión compartida, en memoria, de los favoritos.

La especificación no determina arquitectura de componentes, ubicación exacta del estado, estrategia de enrutamiento interna ni otros detalles técnicos que se concretarán en `PLAN.md`.

## 4. Fuera de alcance

- Implementar código o crear componentes.
- Generar el dataset en esta fase.
- Crear especificaciones de diseño individual para cada página.
- Integrar bases de datos, servicios o APIs externas.
- Persistir favoritos entre sesiones o recargas.
- Añadir librerías externas de gestión de estado.
- Definir autenticación, cuentas reales, reservas, pagos o transacciones.
- Desarrollar todavía la búsqueda, filtros, ordenación o sincronización de parámetros de URL descritos en el README como funcionalidades previstas.

## 5. Requisitos funcionales identificados

### RF-001 — Modelo de datos

Existirá una interfaz TypeScript `Experience` en `src/types/experience.ts` que defina como mínimo:

- `id`: identificador único de la experiencia.
- `title`: título.
- `description`: descripción.
- `category`: categoría restringida exclusivamente a `Adventure`, `Culture`, `Food`, `Wellness` o `Nature`.
- `destination`: ciudad y país asociados a la experiencia.
- `price`: precio positivo expresado en euros.
- `rating`: valoración entre 0 y 5, ambos inclusive.
- `imageUrl`: ruta o URL de una imagen o placeholder.

Los valores técnicos de categoría e identificadores permanecerán en inglés. La interfaz presentará las categorías traducidas al español, sin cambiar los valores internos permitidos.

### RF-002 — Dataset

Existirá un array local de exactamente 100 experiencias en `src/data/experiences.ts`, cuyos elementos cumplirán la interfaz `Experience`.

El dataset deberá:

- Contener identificadores únicos.
- Distribuirse equitativamente: exactamente 20 experiencias por cada categoría permitida.
- Incluir variedad de ciudades y países.
- Tener títulos y descripciones en español.
- Usar precios positivos expresados en euros y valoraciones desde 0 hasta 5 inclusive.
- Usar imágenes válidas o placeholders adecuados.
- Poder reutilizarse desde cualquier página de la aplicación.
- Ser la fuente local de datos, sin depender de una base de datos ni de una API externa.

### RF-003 — Identidad visual global

Los estilos globales y las páginas de la aplicación deberán aplicar de forma coherente la identidad de [`docs/DESIGN.md`](../../docs/DESIGN.md), incluyendo:

- Paleta: verde bosque `#184E45`, terracota `#E58B5B`, crema `#F8F6F0`, blanco `#FFFFFF`, carbón `#202B28` y verde salvia `#74837C`, según los usos indicados en el documento visual.
- Playfair Display para títulos e Inter para texto general.
- Iconografía Lucide Icons.
- Estilos globales compartidos.
- Enfoque mobile-first y adaptación responsiva.
- Accesibilidad, con contraste adecuado y jerarquía visual clara.
- Coherencia visual entre rutas, favoreciendo elementos reutilizables.

### RF-004 — Estructura compartida

La aplicación contemplará las siguientes rutas:

- `/`: inicio.
- `/experiences`: explorador de experiencias.
- `/experiences/[id]`: detalle de una experiencia identificada por su `id`.
- `/favorites`: experiencias favoritas.
- `/profile`: perfil simulado.

La navegación entre estas rutas deberá realizarse del lado del cliente, sin recargas completas de página. Las páginas compartirán una Navbar que indique visualmente cuál es la ruta activa. La ruta activa se identificará mediante `usePathname`.

### RF-005 — Estado compartido de favoritos

La aplicación deberá gestionar de forma centralizada los identificadores de experiencias favoritas. El comportamiento deberá:

- Mantener esos identificadores mediante `useState` de nivel superior.
- Permitir añadir una experiencia a favoritos y quitarla de favoritos.
- Compartir el estado entre las diferentes páginas y mantenerlo al navegar entre rutas.
- Permitir que las vistas que lo necesiten reciban los datos y funciones mediante props.
- Permitir consultar el número actual de experiencias favoritas.
- No utilizar Redux, Zustand ni otras librerías externas de gestión de estado.
- No utilizar `localStorage` ni ningún otro mecanismo de persistencia.

La solución técnica concreta para compartir el estado se determinará en `PLAN.md`.

## 6. Requisitos no funcionales

- **Idioma:** todos los textos dirigidos al usuario estarán en español; se conservan en inglés los nombres técnicos y categorías internas indicadas.
- **Responsividad:** el diseño deberá funcionar desde pantallas móviles y adaptarse a tamaños mayores.
- **Accesibilidad:** texto, controles e iconografía deberán mantener legibilidad, contraste adecuado y jerarquía visual comprensible.
- **Coherencia:** todas las rutas deberán seguir la identidad definida en `docs/DESIGN.md` y compartir los elementos globales establecidos.
- **Tipado:** los datos de experiencias deberán ajustarse al contrato TypeScript `Experience`.
- **Navegación:** los cambios de ruta previstos deberán evitar recargas completas de documento.
- **Datos autónomos:** el catálogo no dependerá de conectividad con APIs ni servicios externos.
- **Estado efímero:** los favoritos solo se mantendrán durante la vida de la aplicación en memoria y no se conservarán tras una recarga o nueva sesión.

## 7. Reglas de negocio

1. Solo se admiten las categorías internas `Adventure`, `Culture`, `Food`, `Wellness` y `Nature`.
2. Cada categoría tendrá exactamente 20 experiencias; el total del catálogo será 100.
3. Cada experiencia tendrá un `id` único dentro del catálogo.
4. `price` será mayor que cero y representará euros.
5. `rating` estará en el intervalo inclusivo `[0, 5]`.
6. `destination` identificará una ciudad y un país.
7. Los títulos y las descripciones de las experiencias estarán redactados en español.
8. Una experiencia podrá añadirse o eliminarse de favoritos por su identificador; no deberá contarse más de una vez entre los favoritos.
9. El conteo de favoritos corresponderá al número de identificadores favoritos disponibles en el estado compartido.
10. Los valores de categoría usados internamente no se sustituirán por sus traducciones de interfaz.

## 8. Criterios de aceptación verificables

- **CA-001:** existe `src/types/experience.ts` y exporta una interfaz `Experience` con todos los campos mínimos definidos; `category` solo admite los cinco valores especificados.
- **CA-002:** existe `src/data/experiences.ts` con un array tipado de exactamente 100 elementos.
- **CA-003:** una comprobación del dataset confirma 100 identificadores no repetidos y exactamente 20 registros por categoría.
- **CA-004:** cada experiencia tiene título y descripción en español, ciudad y país, precio mayor que cero en euros, valoración entre 0 y 5 inclusive e imagen válida o placeholder.
- **CA-005:** el catálogo es importable desde distintas páginas sin base de datos ni llamadas a una API externa.
- **CA-006:** todas las páginas usan los colores, tipografías e iconografía definidos en `docs/DESIGN.md`, con estilos globales coherentes.
- **CA-007:** las cinco rutas previstas son accesibles mediante navegación del lado del cliente, sin recarga completa del documento.
- **CA-008:** la Navbar compartida identifica la ruta actual usando `usePathname` y presenta un indicador visual perceptible para la ruta activa.
- **CA-009:** al añadir o quitar un favorito, las vistas que comparten ese estado reflejan el cambio durante la navegación entre rutas.
- **CA-010:** se puede consultar el total de favoritos; añadir repetidamente el mismo identificador no incrementa el total más de una vez.
- **CA-011:** al recargar la aplicación, los favoritos no se restauran desde almacenamiento persistente.
- **CA-012:** la gestión de favoritos no introduce Redux, Zustand u otra librería externa.
- **CA-013:** la interfaz está en español y conserva en inglés los identificadores técnicos y valores internos de categoría.
- **CA-014:** el diseño es mobile-first y mantiene legibilidad y contraste adecuado en las vistas previstas.

## 9. Dependencias con futuras especificaciones

- Las especificaciones de páginas dependerán del contrato `Experience`, del catálogo local y de las categorías definidas aquí.
- Inicio, explorador, detalle y favoritos dependerán de las reglas compartidas de estado de favoritos cuando presenten acciones o conteos relacionados.
- Todas las páginas dependerán de la identidad visual común de `docs/DESIGN.md` y de la navegación compartida.
- La futura planificación (`PLAN.md`) deberá concretar las decisiones técnicas pendientes sin contradecir estos requisitos.
- Las funcionalidades de búsqueda, filtros, detalle ampliado y perfil podrán especificarse en fases posteriores; esta SPEC solo establece las bases necesarias para ellas.

## 10. Decisiones pendientes

Estas decisiones se resolverán en `PLAN.md` o en especificaciones posteriores, sin bloquear los requisitos funcionales aquí establecidos:

- Qué propiedades opcionales adicionales, si alguna, necesitará `Experience`.
- El formato interno exacto de `price` (por ejemplo, número en euros y formato de presentación).
- El origen, formato y política de disponibilidad de las imágenes o placeholders.
- La técnica para proporcionar el estado de favoritos a las rutas y evitar la pérdida al navegar.
- El diseño concreto de la Navbar, sus etiquetas, orden, comportamiento en móvil e indicador visual de ruta activa.
- La estrategia para cargar Playfair Display e Inter y disponer de iconos Lucide, respetando las dependencias existentes y cualquier decisión de instalación que requiera aprobación.
- Los umbrales y métodos concretos para verificar contraste y accesibilidad.
- El alcance funcional del perfil simulado y los estados de rutas o identificadores inexistentes.
