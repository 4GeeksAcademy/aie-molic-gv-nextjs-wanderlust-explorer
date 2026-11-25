# Wanderlust Explorer

Wanderlust Explorer es una aplicación web interactiva para descubrir y explorar experiencias turísticas alrededor del mundo.

El proyecto propone una plataforma travel-tech donde los usuarios pueden buscar experiencias, filtrarlas por categoría y destino, consultar información detallada y guardar sus actividades favoritas.

Desarrollado como parte de la formación en AI Engineering de 4Geeks Academy.

> Estado del proyecto: en desarrollo.

## Funcionalidades previstas

- Explorador con un catálogo de 100 experiencias turísticas.
- Búsqueda por título mediante expresiones regulares.
- Filtrado por categoría y destino.
- Sincronización de búsquedas y filtros con los parámetros de la URL.
- Páginas individuales de detalle de cada experiencia.
- Gestión de experiencias favoritas mediante el estado de React.
- Perfil de usuario simulado.
- Navegación entre páginas sin recargas completas.
- Diseño responsivo y mobile-first.

## Tecnologías

- Next.js — App Router.
- React.
- TypeScript.
- Tailwind CSS.
- Lucide Icons.
- ESLint.
- Git y GitHub.

## Páginas de la aplicación

| Ruta | Descripción |
|---|---|
| `/` | Página de inicio |
| `/experiences` | Explorador de experiencias |
| `/experiences/[id]` | Detalle de una experiencia |
| `/favorites` | Experiencias favoritas |
| `/profile` | Perfil de usuario |

## Dataset

La aplicación utilizará un dataset local de 100 experiencias turísticas generadas con inteligencia artificial y tipadas mediante una interfaz de TypeScript.

Las experiencias se distribuirán en cinco categorías:

- Aventura (Adventure).
- Cultura (Culture).
- Gastronomía (Food).
- Bienestar (Wellness).
- Naturaleza (Nature).

No se requiere una base de datos ni una API externa.

## Metodología de desarrollo

El proyecto sigue la metodología Spec-Driven Development (SDD), organizando el desarrollo mediante especificaciones funcionales, planificación técnica y tareas de implementación.

Cada fase de desarrollo contará con:

- `SPEC.md`: requisitos funcionales y criterios de aceptación.
- `PLAN.md`: estrategia de implementación técnica.
- `TASKS.md`: tareas de desarrollo y validación.

La identidad visual global se encuentra documentada en [`docs/DESIGN.md`](docs/DESIGN.md).

## Design References

Las siguientes plataformas constituyen las referencias visuales iniciales para el diseño de Wanderlust Explorer:

- [GetYourGuide](https://www.getyourguide.com/es-es/): inspiración para el explorador de experiencias, las tarjetas, la búsqueda y los filtros.
- [Klook](https://www.klook.com/): inspiración para la organización de categorías, destinos y contenido visual.
- [Withlocals](https://www.withlocals.com/): inspiración para la estética fotográfica y la presentación de experiencias auténticas.

El objetivo es desarrollar una identidad visual propia, moderna y natural, inspirada en el diseño editorial de viajes.

## Instalación y ejecución

### Requisitos

- Node.js compatible con la versión de Next.js del proyecto.
- npm.

### Instalar dependencias

```bash
npm install
```

### Ejecutar en desarrollo

```bash
npm run dev
```

Abre http://localhost:3000 en tu navegador.

### Comprobar la calidad del código

```bash
npm run lint
```

### Generar la versión de producción

```bash
npm run build
```

### Ejecutar la versión de producción

```bash
npm run start
```

## Autoría

Proyecto desarrollado por Mónica Gómez-Vadillo como parte del programa de AI Engineering de 4Geeks Academy.