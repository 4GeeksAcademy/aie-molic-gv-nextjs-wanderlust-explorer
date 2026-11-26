# PLAN — Fundamentos compartidos de Wanderlust Explorer

## Estado final de auditoría

La base funcional está implementada. El catálogo local de 100 registros fue generado mediante IA durante esta fase, según confirmación del usuario. Se mantienen pendientes las comprobaciones manuales de navegador/responsive y de recarga/estado efímero que no se han confirmado como realizadas. Las licencias de las fotografías heredadas no se consideran acreditadas por esta confirmación.

## 1. Enfoque

Implementar los fundamentos como módulos pequeños dentro de `src/`, aprovechando Next.js App Router, React y TypeScript ya instalados. Las cinco páginas tendrán estructura provisional mínima; su diseño y comportamiento definitivos se dejarán a futuras especificaciones. No se añadirán bases de datos, APIs, persistencia ni librerías externas de estado.

## 2. Arquitectura y estructura prevista

```text
src/
├── app/
│   ├── layout.tsx                 # layout global, metadata y proveedor de favoritos
│   ├── globals.css                # tokens y estilos globales mobile-first
│   ├── page.tsx                   # /
│   ├── experiences/page.tsx       # /experiences
│   ├── experiences/[id]/page.tsx  # /experiences/[id]
│   ├── favorites/page.tsx         # /favorites
│   └── profile/page.tsx           # /profile
├── components/
│   ├── layout/Navbar.tsx          # navegación común, Client Component
│   └── favorites/FavoritesProvider.tsx # estado de favoritos, Client Component
├── data/
│   └── experiences.ts             # catálogo local tipado
└── types/
    └── experience.ts              # contrato y tipos derivados
```

Las páginas y componentes de presentación permanecerán como Server Components siempre que no necesiten interactividad. El proveedor y la Navbar serán Client Components. Las páginas individuales podrán incorporar únicamente el límite cliente que requieran para consumir el estado compartido; no se convertirá toda la aplicación en cliente.

## 3. Modelo de datos y tipos

En `src/types/experience.ts` se definirá `Experience`, con campos mínimos `id`, `title`, `description`, `category`, `destination`, `price`, `rating` e `imageUrl`. Se usará una unión literal exportada `ExperienceCategory` con `Adventure | Culture | Food | Wellness | Nature`, para restringir la categoría en compilación. `destination` se representará como una estructura simple con ciudad y país para hacer explícito el requisito de ambos datos. `price` será un número finito en euros; la presentación lo formateará con `Intl.NumberFormat` y locale `es-ES`. `rating` será numérico; sus límites se comprobarán en validación de datos, pues TypeScript no expresa por sí solo un rango numérico.

Se mantendrán los campos mínimos requeridos y no se añadirán propiedades de dominio no solicitadas. El mapeo visible de categorías a español se mantendrá en una constante tipada en inglés en el mismo módulo o en un módulo pequeño de presentación, evitando alterar la categoría interna.

## 4. Dataset, validación e imágenes

`src/data/experiences.ts` exportará un array de solo lectura (`Experience[]` compatible, con tipos literales preservados cuando resulte conveniente) y local. Será el único origen del catálogo; ninguna página realizará solicitudes externas. El catálogo de 100 registros fue generado mediante IA durante `001-foundation`, confirmado por el usuario en la auditoría final; no es generación en tiempo de ejecución.

La generación de contenido se hará como datos estáticos revisables, no mediante generación en tiempo de ejecución. La validación cubrirá: longitud total 100, IDs no vacíos y únicos, veinte elementos por categoría, campos de texto en español, ciudad y país informados, precio finito positivo, valoración finita en `[0, 5]` y referencia de imagen presente. Estas comprobaciones se automatizarán con pruebas o una comprobación de datos ejecutable en el proyecto, sin incorporar dependencias de validación innecesarias.

Las imágenes serán archivos locales bajo `public/images/experiences/` cuando se disponga de activos adecuados. Para completar el catálogo sin depender de hosts externos, se admitirá como placeholder una ruta local estable a una imagen genérica incluida en `public/`; las referencias deberán corresponder a recursos existentes. No se añadirá carga remota ni configuración de dominios de imágenes en Next.js. La selección/creación concreta de activos podrá resolverse al ejecutar la tarea de imágenes. La generación IA del dataset no acredita la procedencia ni la licencia de las fotografías; cualquier activo cuya documentación no exista seguirá expresamente pendiente de verificación.

## 5. Identidad visual y estilos globales

Se actualizarán `src/app/globals.css` y `src/app/layout.tsx` para centralizar tokens CSS basados exactamente en `docs/DESIGN.md`: `#184E45`, `#E58B5B`, `#F8F6F0`, `#FFFFFF`, `#202B28` y `#74837C`. El crema será el fondo principal, el blanco las superficies, el carbón el texto principal, el salvia el secundario, el verde el primario y la terracota el acento. El CSS seguirá usando Tailwind CSS 4 ya configurado, reservando variables CSS para tokens globales y estilos base.

Se utilizarán Playfair Display para títulos e Inter para texto general. Como el proyecto ya carga fuentes mediante `next/font/google` pero no tiene fuentes locales, se conservará el enfoque `next/font` con ambas familias en el layout, una vez verificada su disponibilidad y configuración conforme a la documentación instalada. Si las condiciones de ejecución requieren evitar descarga externa en build, se acordará alternativa local antes de añadir activos. Lucide Icons no está instalado actualmente; la implementación deberá confirmar con aprobación si se autoriza añadir `lucide-react` como dependencia, o en su defecto dejar iconos simples accesibles basados en texto/elementos existentes hasta esa autorización. No se instalará nada durante esta fase documental.

Los estilos globales tendrán reset/base razonables, foco visible, tipografía por función y comportamiento mobile-first. El contraste de texto y controles se comprobará con los criterios WCAG 2.2 AA para texto normal y grande. Los estilos comunes no anticiparán el diseño final de cada página.

## 6. Navegación y estructura App Router

Se crearán las cinco rutas en `src/app/` según el árbol anterior. `RootLayout` seguirá siendo Server Component y establecerá `lang="es"`, metadata de Wanderlust Explorer, estilos y el límite del proveedor compartido.

La Navbar usará `next/link` para navegación cliente y `usePathname` para detectar la ruta actual. El estado activo considerará coincidencias exactas para `/`, `/experiences`, `/favorites`, `/profile` y prefijo adecuado para `/experiences/[id]`. El indicador visual tendrá además una señal semántica accesible, por ejemplo `aria-current="page"` en el enlace correspondiente. La Navbar será común a todas las rutas mediante el layout raíz.

Las páginas de rutas podrán ser Server Components por defecto. Solo el punto que consuma `useFavorites` será cliente. El dataset local podrá importarse en servidor y en componentes cliente según se necesite; no habrá acceso a APIs del navegador desde módulos compartidos.

## 7. Estado compartido de favoritos

Un `FavoritesProvider` client-side, montado una sola vez en el layout raíz y persistente entre segmentos, será el propietario de `useState<string[]>`. Expondrá una API mínima —IDs, `addFavorite`, `removeFavorite`, `isFavorite` y conteo— mediante un hook propio/contexto de React, sin dependencias externas. Las páginas o componentes interactivos consumirán esos valores y pasarán los datos y funciones mediante props a componentes de presentación cuando corresponda.

Las operaciones serán idempotentes: añadir un ID existente no lo duplicará y eliminar uno ausente no alterará el resto. El estado vivirá exclusivamente en memoria. No se leerá ni escribirá `localStorage`, cookies, URL ni backend. Una navegación entre rutas no desmontará el proveedor; una recarga reiniciará el estado, tal como exige la SPEC.

## 8. Validación y pruebas

La validación se realizará en capas:

1. TypeScript y ESLint mediante los scripts existentes `npm run lint` y la comprobación de tipos incluida en `npm run build`.
2. Pruebas deterministas del catálogo para cantidad, unicidad, distribución, rangos y referencias locales de imágenes.
3. Pruebas de operaciones de favoritos: agregar, eliminar, idempotencia, conteo y persistencia del estado durante navegación entre rutas; verificar también que una recarga comienza sin favoritos.
4. Verificación de rutas, enlace activo de Navbar y navegación sin recarga completa en navegador.
5. Revisión visual responsive en viewport móvil y amplio y comprobación de contraste/foco.

El `package.json` no incluye actualmente framework de pruebas. Antes de añadirlo, se preferirá aprovechar herramientas existentes o las capacidades nativas de Node/TypeScript disponibles; cualquier dependencia adicional de pruebas deberá justificarse y aprobarse en la fase de implementación. No se ejecutan instalaciones en esta planificación.

### Estado de validación registrado

- Confirmación del usuario: dataset de 100 experiencias generado mediante IA en esta fase.
- Verificaciones documentadas previamente: TypeScript, validación del catálogo (cantidad, unicidad, distribución, campos y rangos), build y respuestas HTTP de rutas. No se vuelve a atribuir a esta auditoría la ejecución histórica de cada comprobación del dataset.
- Auditoría final actual: `npm run lint`, `npx tsc --noEmit`, `npm run build` y `git diff --check` ejecutados correctamente; inspección estática verificó 100 referencias de imágenes locales sin rutas inexistentes.
- Pendiente: validación manual en navegador de navegación sin recarga, intercambio de favoritos entre rutas y reinicio tras recarga, interacción por teclado/foco y revisión responsive/visual. No se marca T-007 como completada hasta contar con confirmación de estas pruebas.

## 9. Decisiones técnicas y justificación

- **Catálogo local estático:** satisface reutilización y funcionamiento autónomo con la mínima infraestructura.
- **Destino como ciudad/país estructurados:** evita cadenas ambiguas y permite verificar ambos requisitos.
- **Precio como número en euros:** simplifica validación y formato localizado con APIs nativas.
- **Placeholder local:** elimina dependencia de red y de dominios externos, y facilita verificar recursos.
- **Proveedor React en el layout raíz:** preserva un único estado a través de cambios de ruta sin persistencia ni librerías adicionales.
- **App Router y `Link`:** aprovecha la navegación cliente estándar de Next.js.
- **Server Components por defecto:** limita JavaScript cliente a Navbar y las interacciones de favoritos.
- **Tokens CSS y Tailwind existente:** centraliza consistencia sin incorporar otra solución de estilos.
- **Lucide pendiente de aprobación:** `lucide-react` no aparece entre las dependencias; no se añadirá silenciosamente.
- **Páginas provisionales:** permiten validar arquitectura y navegación sin cerrar decisiones de diseño específicas.

## 10. Aspectos que requieren aprobación

1. Autorizar la incorporación de `lucide-react` para cumplir el requisito de Lucide Icons; actualmente sí figura en `package.json` y ya se utiliza.
2. Confirmar si se permite usar `next/font/google` para Playfair Display e Inter, que puede necesitar acceso a red durante la preparación/build, o si se prefieren archivos de fuente locales; el proyecto ya los configura y el build actual pasa.
3. Acordar el método de pruebas si la cobertura automatizada requerida demanda incorporar un framework de pruebas que no está instalado; no añadir dependencia sin autorización.
4. Documentar procedencia/licencia de activos fotográficos sin acreditación. No atribuir licencias ni inferir que la confirmación de generación IA del dataset cubre los derechos de imágenes.

Estos puntos no impiden completar una planificación conceptual, pero se resolverán antes de cualquier cambio que añada dependencias o activos externos.
