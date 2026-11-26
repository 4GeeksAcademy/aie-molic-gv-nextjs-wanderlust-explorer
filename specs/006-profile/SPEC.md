# 006 — Perfil simulado

## Estado

Especificación funcional y visual propuesta. Esta fase documenta la página `/profile`; no autoriza implementación hasta su aprobación.

## Objetivo

Ofrecer una página de perfil personal sencilla que represente a una persona viajera ficticia y conecte su perfil con sus favoritos actuales y el catálogo de experiencias.

## Contexto

La ruta `/profile` existe como página provisional. La aplicación ya dispone de `FavoritesProvider` global, que expone `favoriteCount` y mantiene el estado de favoritos en memoria durante la sesión. El `RootLayout` proporciona globalmente Navbar, contenido principal y Footer, y configura el idioma del documento como español. La navegación ya incluye el enlace «Perfil».

## Alcance

La página `/profile` deberá presentar:

1. Un título principal «Mi perfil» y una introducción breve en español.
2. Una tarjeta de perfil simulado con avatar visual (icono Lucide o iniciales), nombre ficticio, correo ficticio y una descripción breve relacionada con viajes.
3. Un resumen de favoritos cuyo valor corresponda al `favoriteCount` real de `FavoritesProvider`, más un enlace «Ver mis favoritos» que navegue a `/favorites`.
4. Una llamada a la acción que permita explorar experiencias y navegue a `/experiences`.
5. El Navbar y Footer globales existentes, sin duplicarlos dentro de la página.

Los datos personales presentados serán contenido estático de demostración, no datos de una cuenta real.

## Requisitos funcionales

- **RF-01 — Encabezado:** mostrar exactamente «Mi perfil» como título principal y acompañarlo de una breve introducción en español.
- **RF-02 — Perfil simulado:** mostrar avatar (icono Lucide decorativo o iniciales), nombre ficticio, correo ficticio y una descripción concisa vinculada a viajes. El avatar no dependerá de imágenes externas ni de una cuenta autenticada.
- **RF-03 — Conteo real:** mostrar el número actual de favoritos mediante el estado compartido de `FavoritesProvider`; no usar un número fijo, derivado de estadísticas inventadas ni duplicar estado local.
- **RF-04 — Acceso a favoritos:** proporcionar el enlace textual «Ver mis favoritos» con destino `/favorites`.
- **RF-05 — Explorar:** proporcionar una llamada a la acción con destino `/experiences`.
- **RF-06 — Estado vacío:** cuando el conteo sea cero, mostrar cero de forma clara y conservar accesibles ambos enlaces de navegación; no presentar un estado de error.
- **RF-07 — Navegación global:** dejar que el layout existente proporcione Navbar y Footer. El elemento «Perfil» de la navegación global debe reflejar la ruta activa mediante el comportamiento ya existente.

## Requisitos visuales y de interacción

- Respetar la identidad de `docs/DESIGN.md` y los tokens/estilos globales existentes: paleta bosque, crema, terracota, blanco, carbón y salvia; tipografía Playfair Display para títulos e Inter para texto; iconografía Lucide cuando corresponda.
- Mantener una composición clara, editorial y mobile-first, legible en pantallas estrechas y amplias, sin desbordamiento horizontal.
- La tarjeta debe distinguirse del fondo y organizar avatar e información personal con una jerarquía visual reconocible. El resumen de favoritos y las acciones deben ser fáciles de localizar.
- Mantener contraste suficiente, foco visible en enlaces y orden de lectura lógico. Los iconos puramente decorativos no deben anunciarse a tecnologías de asistencia; los enlaces deben tener texto comprensible.
- Usar estructura semántica: un único encabezado `h1` para el título, encabezados subordinados cuando se requieran y enlaces nativos para la navegación.

## Fuera de alcance y restricciones

- Autenticación, cuentas reales, formularios o edición de perfil.
- Persistencia del perfil o de favoritos, almacenamiento local, APIs, servidor de usuarios o base de datos.
- Modificar el modelo/dataset `Experience`, el proveedor de favoritos, Navbar, Footer u otras funcionalidades existentes.
- Añadir componentes reutilizables nuevos o estado duplicado para el conteo de favoritos.
- Añadir estadísticas ficticias distintas de los datos de demostración de identidad descritos en el alcance.
- Cambios a otras rutas, dependencias o infraestructura.

## Criterios de aceptación

- **CA-01:** al visitar `/profile`, se muestra «Mi perfil», una introducción en español y el bloque de perfil ficticio con avatar, nombre, correo y descripción de viajes.
- **CA-02:** con cero favoritos, el resumen presenta `0` y el enlace «Ver mis favoritos» lleva a `/favorites`.
- **CA-03:** tras cambiar los favoritos desde la funcionalidad existente, el valor mostrado en perfil refleja el `favoriteCount` compartido, sin recargar la página ni mantener un contador paralelo.
- **CA-04:** la llamada a la acción de explorar lleva a `/experiences`.
- **CA-05:** Navbar y Footer aparecen una sola vez, proporcionados por el layout global; Navbar identifica Perfil como sección activa.
- **CA-06:** la página permanece legible y utilizable en móvil y escritorio, con enlaces navegables por teclado, foco visible, jerarquía semántica y sin desbordamiento horizontal.
- **CA-07:** la página no introduce autenticación, edición, persistencia, API/base de datos, métricas ficticias ni modificaciones a funcionalidades fuera de alcance.
