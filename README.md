# Wanderlust Explorer

Aplicación web de exploración de experiencias turísticas creada como proyecto de portfolio y entrega formativa de AI Engineering en 4Geeks Academy. Permite descubrir actividades, consultar sus detalles, filtrar el catálogo y guardar favoritos en una interfaz en español, responsive y con una identidad visual editorial de viajes.

## Funcionalidades principales

- Inicio con buscador, accesos por categoría y destino y experiencias destacadas.
- Catálogo explorable con búsqueda por título, filtros combinables por categoría y país, chips de filtros activos, estado vacío y paginación.
- Búsqueda, filtros y página sincronizados con los parámetros de la URL para abrir y compartir vistas filtradas.
- Página individual para cada experiencia, con información del catálogo y sugerencias relacionadas.
- Favoritos compartidos entre las páginas durante la navegación, con contador y acciones para añadir o quitar.
- Perfil de usuario simulado con resumen dinámico de favoritos; no hay autenticación ni cuentas reales.
- Navegación común y diseño adaptable a distintos tamaños de pantalla.

## Tecnologías

- [Next.js](https://nextjs.org/) 16 con App Router.
- [React](https://react.dev/) 19.
- [TypeScript](https://www.typescriptlang.org/) 5.
- Tailwind CSS 4 y CSS para estilos globales y módulos.
- [Lucide React](https://lucide.dev/) para iconografía.
- ESLint para análisis estático.

## Estructura del proyecto

```text
src/
├── app/                         # Rutas, layout global y estilos
│   ├── experiences/
│   │   └── [id]/                # Detalle dinámico y not-found
│   ├── favorites/               # Página de favoritos
│   └── profile/                 # Perfil simulado
├── components/
│   ├── experiences/             # Explorador, tarjetas e imágenes de detalle
│   ├── favorites/               # Provider y controles de favoritos
│   ├── home/                    # Buscador, categorías y destacadas
│   └── layout/                  # Navbar y Footer compartidos
├── data/                        # Catálogo local de experiencias
└── types/                       # Modelo y tipos de dominio

public/images/                   # Imágenes locales de la aplicación
specs/                           # Especificaciones, planes y tareas SDD
	001-foundation/
	002-home/
	003-explorer/
	004-experience-detail/
	005-favorites/
	006-profile/
docs/DESIGN.md                   # Identidad visual
```

## Instalación y ejecución local

### Requisitos

- Node.js compatible con Next.js 16.
- npm.

### Preparar el entorno

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

### Comprobaciones y producción

```bash
npm run lint
npx tsc --noEmit
npm run build
npm run start
```

`npm run start` sirve la compilación de producción y requiere haber ejecutado `npm run build` previamente.

## Rutas disponibles

| Ruta | Descripción |
|---|---|
| `/` | Página de inicio, buscador, categorías y experiencias destacadas. |
| `/experiences` | Catálogo con búsqueda, filtros y paginación. |
| `/experiences/[id]` | Detalle de una experiencia identificada por su ID. |
| `/favorites` | Lista de experiencias guardadas en favoritos. |
| `/profile` | Perfil simulado y resumen de favoritos. |

## Dataset de experiencias

El proyecto incluye un dataset local tipado de **100 experiencias generado mediante inteligencia artificial**. Contiene 20 registros en cada una de las categorías internas `Adventure`, `Culture`, `Food`, `Wellness` y `Nature`; las etiquetas visibles se presentan en español. El catálogo es estático, se comparte desde `src/data/experiences.ts` y no requiere base de datos ni API externa.

Los datos describen títulos, destinos, precios, valoraciones e imágenes. Las imágenes WebP generadas mediante IA son ilustrativas: su presencia no garantiza una representación exacta de la actividad o el destino.

## Gestión del estado compartido de favoritos

`FavoritesProvider` mantiene los IDs favoritos en estado React (`useState`) en el layout raíz. Las páginas y componentes que lo necesitan consumen el mismo estado para actualizar acciones y contadores durante la navegación.

Los favoritos son **efímeros**: se mantienen mientras la aplicación permanece cargada, pero no se guardan en `localStorage`, cookies ni backend; una recarga inicia el estado de nuevo. No se utiliza una librería externa de gestión de estado.

## Búsqueda, filtros y paginación sincronizados con la URL

El explorador usa los parámetros `search`, `category`, `destination` y `page`. La URL representa la búsqueda, los filtros activos y la página actual; se pueden abrir o compartir enlaces con criterios. La búsqueda se aplica al título, categoría y país se combinan con ella, y los resultados se paginan en grupos de hasta 12 experiencias.

Ejemplo:

```text
/experiences?search=kayak&category=Adventure&destination=Marruecos&page=2
```

Las categorías de la URL usan sus valores internos en inglés. La interfaz muestra controles y etiquetas en español. Al cambiar criterios, Explorer actualiza la navegación sin recargar el documento.

## Metodología SDD

El desarrollo sigue **Spec-Driven Development (SDD)**: cada fase organiza requisitos, plan técnico y tareas mediante `SPEC.md`, `PLAN.md` y `TASKS.md`. El proyecto comprende seis fases:

1. `001-foundation` — modelo, dataset, identidad visual, navegación y estado compartido.
2. `002-home` — página de inicio.
3. `003-explorer` — catálogo, búsqueda, filtros y paginación.
4. `004-experience-detail` — detalle de experiencia.
5. `005-favorites` — página de favoritos.
6. `006-profile` — perfil simulado.

## Design References

Las siguientes plataformas constituyen las referencias visuales iniciales para el diseño de Wanderlust Explorer:

- [GetYourGuide](https://www.getyourguide.com/es-es/): inspiración para el explorador de experiencias, las tarjetas, la búsqueda y los filtros.
- [Klook](https://www.klook.com/): inspiración para la organización de categorías, destinos y contenido visual.
- [Withlocals](https://www.withlocals.com/): inspiración para la estética fotográfica y la presentación de experiencias auténticas.

El objetivo es desarrollar una identidad visual propia, moderna y natural, inspirada en el diseño editorial de viajes. La guía visual del proyecto está en [`docs/DESIGN.md`](docs/DESIGN.md).

## Procedencia de las imágenes y limitaciones conocidas

- El catálogo utiliza imágenes locales, incluidas imágenes WebP generadas mediante IA para uso ilustrativo y un placeholder local.
- También se conservan fotografías heredadas usadas en la Home, categorías y experiencias. **Su procedencia, autoría, atribución y licencia no están acreditadas en la documentación disponible.** Este pendiente debe resolverse antes de afirmar derechos o condiciones de uso; este README no les atribuye una licencia.
- La generación mediante IA del dataset o de imágenes ilustrativas no acredita la procedencia ni la licencia de las fotografías heredadas.
- El perfil es simulado; la aplicación no proporciona autenticación, persistencia de favoritos, reservas ni pagos.

## Autoría

Proyecto desarrollado por Mónica Gómez-Vadillo como parte del programa de AI Engineering de 4Geeks Academy.