# Especificación completa — 4 temas de portafolio SPA

> Cada tema es un universo visual distinto. El objetivo es que al cambiar de tema, todo cambie: cómo se siente el espacio, cómo se lee el texto, cómo se mueve la página, qué tan cerca o lejos se siente el contenido. No solo los colores.

---

## Elementos compartidos en todos los temas

- Modo claro y oscuro, con toggle en navbar. Default según `prefers-color-scheme`.
- Navegación sticky con smooth scroll entre secciones.
- Totalmente responsive (mobile-first).
- Animaciones sutiles al scroll (Intersection Observer) y hover.
- Secciones: Hero → About → Skills → Projects → Experience → Contact → Footer

---

---

# Tema 1 — Minimalista

## Filosofía general

El contenido es el diseño. Nada existe sin una razón. Si un elemento decorativo puede quitarse sin que el usuario pierda información, se quita. El espacio en blanco no es vacío: es respiración. La página debe sentirse como una galería de arte contemporáneo, no como un CV.

**Sensación al entrar:** silencio, claridad, confianza.

---

## Tipografía

La tipografía ES el diseño en este tema. Todo el peso visual recae en ella.

| Uso                                | Fuente                                  | Estilo                                            |
| ---------------------------------- | --------------------------------------- | ------------------------------------------------- |
| Títulos principales (H1, H2)       | `Playfair Display` o `DM Serif Display` | Regular (400), sin negrita artificial             |
| Cuerpo, labels, nav                | `DM Sans` o `Sora`                      | Light (300) para cuerpo, Medium (500) para labels |
| Monoespaciado (tech stack, fechas) | `JetBrains Mono`                        | Regular, tamaño pequeño                           |

- **H1 hero:** 72–96px, peso 400, line-height 1.05, tracking -0.02em
- **Body:** 16px, peso 300, line-height 1.8
- **Labels / overlines:** 11px, uppercase, letter-spacing 0.12em, color muted
- **Jerarquía:** se logra con tamaño y color, nunca con negrita agresiva

---

## Paleta de colores

### Modo claro

| Token              | Valor     | Uso                                    |
| ------------------ | --------- | -------------------------------------- |
| `--bg`             | `#F9F8F5` | Fondo general (blanco cálido, no puro) |
| `--bg-surface`     | `#FFFFFF` | Cards, navbar                          |
| `--text-primary`   | `#141414` | Títulos                                |
| `--text-secondary` | `#555550` | Cuerpo                                 |
| `--text-muted`     | `#999990` | Labels, metadata                       |
| `--border`         | `#E5E4DF` | Líneas divisoras                       |
| `--accent`         | `#141414` | Links activos, CTAs (monocromático)    |

### Modo oscuro

| Token              | Valor     | Uso                           |
| ------------------ | --------- | ----------------------------- |
| `--bg`             | `#0E0E0C` | Fondo (negro cálido, no puro) |
| `--bg-surface`     | `#161614` | Cards, navbar                 |
| `--text-primary`   | `#F0EFE8` | Títulos                       |
| `--text-secondary` | `#A8A89E` | Cuerpo                        |
| `--text-muted`     | `#666660` | Labels, metadata              |
| `--border`         | `#2A2A26` | Líneas divisoras              |
| `--accent`         | `#F0EFE8` | Links activos, CTAs           |

> **Principio:** este tema es casi monocromático. No hay acentos de color vivos. El contraste viene del blanco/negro y de la tipografía serif.

---

## Layout y espaciado

- **Contenedor máximo:** 720px centrado. No más. El ancho restringido es intencional — fuerza la lectura vertical y da sensación de publicación literaria.
- **Padding horizontal:** 24px en mobile, 0 en desktop (el contenedor ya centra).
- **Padding vertical entre secciones:** 120px. Generoso, casi incómodo.
- **Grid de proyectos:** 1 columna en mobile, 2 columnas en desktop. Sin masonry ni layouts raros.
- **Navbar:** Logo (nombre en serif, minúsculas) + links en uppercase pequeño + toggle. Sin fondo opaco — transparente con `backdrop-filter: blur(8px)` solo al hacer scroll.

---

## Sección por sección

### Hero

- Sin imagen de fondo, sin ilustraciones, sin partículas.
- Overline: `"Frontend Developer"` en 11px uppercase muted.
- H1: nombre completo en serif, 80–96px, peso 400, 2–3 líneas si es necesario.
- Bio: 2 frases máximo, 15–16px, light.
- CTA: solo texto con `border-bottom: 1px solid currentColor`. Sin botones con fondo.
- Scroll indicator: una línea vertical de 40px animada (no arrow).

### About

- Dos columnas en desktop: foto izquierda (cuadrada, sin border-radius), texto derecha.
- Foto en escala de grises. Al hover, color — transición suave 0.6s.
- Sin listas de habilidades aquí. Solo prosa.

### Skills

- Lista horizontal de tecnologías separadas por `/` o `·`.
- Sin barras de progreso, sin porcentajes, sin badges de colores. Solo texto.
- Ejemplo: `React · TypeScript · Node.js · PostgreSQL · Figma`

### Projects

- Grid 2 columnas. Cada card: imagen arriba + título + descripción 2 líneas + tech stack en mono pequeño.
- Sin sombras, sin elevación. Hover: `opacity: 0.85` en la imagen.
- Al hacer hover en la card: un `→` aparece junto al título.

### Experience

- Timeline con línea vertical de 1px `var(--border)`.
- Cada item: fecha en mono muted + empresa en bold + cargo + descripción corta.
- Sin iconos de empresa, sin logos.

### Contact

- Solo texto: "¿Trabajamos juntos?" en serif grande.
- Email como link de texto grande.
- Sin formulario. Simplicidad total.

---

## Animaciones y micro-interacciones

- **Entrada de secciones:** fade + translateY(20px) → translateY(0), duración 0.6s, ease-out, stagger entre elementos.
- **Links de navegación:** underline que crece desde la izquierda (`scaleX` transform).
- **Cursor:** default. Sin cursor custom.
- **Transiciones de página:** ninguna. Cambio instantáneo de sección.

---

## Patrones y texturas

- Ninguno. Cero decoración.
- El único "patrón" permitido es la línea del timeline.

---

## Diferenciadores que lo hacen único

1. La fuente serif en los títulos en un portafolio de dev es inesperada y elegante.
2. El ancho máximo de 720px se siente como leer un libro, no una web.
3. La foto en escala de grises → color al hover es el único "efecto" memorable.
4. Los CTAs sin botón dan una sobriedad que pocos portfolios tienen.

---

---

# Tema 2 — Modern Tech

## Filosofía general

Esto es una declaración de habilidades técnicas. La interfaz misma debe demostrar que el desarrollador domina efectos, animaciones y composición visual compleja. Es oscuro por defecto porque la tecnología avanzada vive de noche. Cada elemento tiene energía. La pantalla debe sentirse como un dashboard de misión crítica que también es hermoso.

**Sensación al entrar:** poder, velocidad, precisión, futuro.

---

## Tipografía

| Uso                 | Fuente                                  | Estilo                        |
| ------------------- | --------------------------------------- | ----------------------------- |
| Títulos (H1, H2)    | `Space Grotesk` o `Bricolage Grotesque` | Bold (700), tracking negativo |
| Cuerpo              | `Inter` o `IBM Plex Sans`               | Regular (400)                 |
| Código / tech stack | `JetBrains Mono` o `Fira Code`          | Con ligaduras                 |
| Labels / badges     | `Space Mono`                            | Uppercase, pequeño            |

- **H1 hero:** 80–112px, peso 700–800, tracking -0.03em, en ocasiones partiendo en dos líneas de distinto tamaño.
- **Body:** 15px, peso 400, line-height 1.65.
- **Efecto especial:** el H1 puede tener palabras clave en color neón (solo 1–2 palabras, no todo el texto).

---

## Paleta de colores

### Modo oscuro (default y predominante)

| Token              | Valor       | Uso                                        |
| ------------------ | ----------- | ------------------------------------------ |
| `--bg`             | `#080C10`   | Fondo profundo (azul-negro, no negro puro) |
| `--bg-surface`     | `#0F1620`   | Cards, navbar                              |
| `--bg-elevated`    | `#1A2535`   | Cards al hover, inputs                     |
| `--text-primary`   | `#E8EFF5`   | Títulos                                    |
| `--text-secondary` | `#8A9BB0`   | Cuerpo                                     |
| `--text-muted`     | `#4A5A70`   | Metadata                                   |
| `--border`         | `#1E2D40`   | Bordes normales                            |
| `--border-glow`    | `#00D4FF40` | Bordes con glow (cyan con opacidad)        |
| `--accent-cyan`    | `#00D4FF`   | Acento principal                           |
| `--accent-violet`  | `#8B5CF6`   | Acento secundario                          |
| `--accent-green`   | `#00FF88`   | Acento terciario (éxito, online)           |

### Modo claro

| Token             | Valor     | Uso                              |
| ----------------- | --------- | -------------------------------- |
| `--bg`            | `#F0F4F8` | Fondo                            |
| `--bg-surface`    | `#FFFFFF` | Cards                            |
| `--accent-cyan`   | `#0095C8` | Cyan oscurecido para legibilidad |
| `--accent-violet` | `#6D3FD9` | Violeta oscurecido               |

---

## Layout y espaciado

- **Contenedor máximo:** 1100px. Respira más que el minimalista.
- **Grid de proyectos:** layout tipo Bento. Algunas cards 2x1, otras 1x1. Asimetría controlada.
- **Padding vertical entre secciones:** 80–100px.
- **Navbar:** glassmorphism — `background: rgba(8,12,16,0.7)`, `backdrop-filter: blur(20px)`, `border-bottom: 1px solid var(--border-glow)`.
- **Separadores de sección:** líneas horizontales de 1px con gradiente que se desvanece en los extremos.

---

## Sección por sección

### Hero

- Fondo: un canvas con partículas conectadas (tsParticles o canvas puro, muy sutil, opacidad 0.2).
- Overline: texto monoespaciado con efecto typewriter: `> Inicializando portafolio...`
- H1: nombre grande, y debajo una línea con texto rotativo: "Frontend Dev / UI Engineer / Creative Coder" que cambia con crossfade.
- Botones: outlined con borde `var(--accent-cyan)`, hover con glow `box-shadow: 0 0 20px var(--accent-cyan)40`.
- Decoración lateral: una columna de números binarios o coordenadas cayendo lentamente (muy opaco, decorativo).

### About

- Foto con `clip-path` hexagonal o con borde animado (gradiente que rota alrededor de la foto).
- Métricas destacadas en grid 2x2: años de experiencia, proyectos, etc. Con contador animado al scroll.
- Skills como badges con distintos colores de acento.

### Skills

- Barras de progreso animadas al scroll — pero con estética de terminal: `████████░░ 80%`.
- Agrupadas por categoría: Frontend / Backend / Tools. Cada categoría con su acento de color.
- Al hover en una skill: aparece tooltip con 1 línea de contexto.

### Projects

- Grid Bento: 3 columnas, cards de distinto tamaño.
- Cada card: fondo oscuro + imagen con overlay de gradiente + tags flotantes + título grande.
- Al hover: `transform: translateY(-6px)`, sombra con glow del color de acento de ese proyecto.
- Badge de estado: `// live` en verde o `// in progress` en amber.
- Filtros por categoría (tabs de texto, sin estilo agresivo).

### Experience

- Timeline horizontal en desktop (scroll lateral o línea visual), vertical en mobile.
- Nodos de la timeline: círculos con borde neón.
- Al hacer click o hover en un nodo: expand con animación.

### Contact

- Terminal simulada: input que parece una consola.
- Al escribir y enviar: respuesta animada "Mensaje recibido. Procesando..." con efecto de código.
- Alternativamente: formulario con inputs de estilo glassmorphism.

---

## Animaciones y micro-interacciones

- **Entrada de secciones:** fade + pequeño blur(4px) → blur(0), duración 0.5s.
- **Hover en cards:** elevación + glow en borde.
- **Cursor custom:** punto pequeño + anillo que sigue con delay (CSS o JS). Solo en desktop.
- **Scroll progress bar:** línea de 2px en la parte superior del viewport que avanza con el scroll, en color cyan.
- **Navbar links:** al hover, underline con color neón y pequeño flash.

---

## Patrones y texturas

- **Grid pattern en hero:** CSS `background-image: linear-gradient(var(--border) 1px, transparent 1px)` — cuadrícula muy sutil.
- **Gradiente radial en hero:** desde el centro, del color del acento a transparente, muy difuso.
- **Noise texture sutil:** `opacity: 0.025` sobre las cards para quitar la sensación de "plástico".

---

## Diferenciadores que lo hacen único

1. El layout Bento de proyectos demuestra criterio de diseño, no solo dev.
2. La navbar glassmorphism en oscuro se ve premium sin esfuerzo.
3. El cursor custom es el detalle que la gente menciona.
4. El efecto typewriter en el hero ya es esperado — lo que lo diferencia es el texto rotativo debajo del nombre.

---

---

# Tema 3 — Profesional

## Filosofía general

Aquí el usuario está buscando trabajo serio, comunicando seniority, o apuntando a clientes corporativos. La interfaz transmite: "Sé lo que hago, lo he hecho bien, y puedo repetirlo." No hay trucos visuales ni efectos llamativos. La estructura es el mensaje. Debe verse como un producto de software bien pensado, no como un experimento creativo.

**Sensación al entrar:** estructura, confianza, claridad ejecutiva.

---

## Tipografía

| Uso                  | Fuente                                                     | Estilo         |
| -------------------- | ---------------------------------------------------------- | -------------- |
| Títulos (H1, H2)     | `Plus Jakarta Sans` o `Neue Haas Grotesk`                  | SemiBold (600) |
| Cuerpo               | `Plus Jakarta Sans` (misma fuente, peso normal)            | Regular (400)  |
| Datos, fechas, stats | `Tabular Numbers` con `font-variant-numeric: tabular-nums` | Medium (500)   |

- Usar una sola familia de fuente con muchos pesos es una señal de madurez de diseño.
- **H1 hero:** 56–72px, peso 600, tracking -0.01em. Más contenido que el minimalista.
- **Body:** 15px, peso 400, line-height 1.65.
- **Jerarquía de labels:** 12px, peso 500, uppercase, letter-spacing 0.08em.

---

## Paleta de colores

### Modo claro

| Token              | Valor     | Uso                                                         |
| ------------------ | --------- | ----------------------------------------------------------- |
| `--bg`             | `#FFFFFF` | Fondo                                                       |
| `--bg-surface`     | `#F7F7F8` | Secciones alternas, cards                                   |
| `--bg-dark`        | `#0F1929` | Sección hero (oscuro sobre claro crea contraste de sección) |
| `--text-primary`   | `#0D1117` | Títulos                                                     |
| `--text-secondary` | `#4A5568` | Cuerpo                                                      |
| `--text-muted`     | `#A0AEC0` | Metadata                                                    |
| `--border`         | `#E2E8F0` | Bordes                                                      |
| `--accent`         | `#2563EB` | Azul profesional                                            |
| `--accent-light`   | `#EFF6FF` | Fondo de badges, highlights                                 |

### Modo oscuro

| Token              | Valor     | Uso                        |
| ------------------ | --------- | -------------------------- |
| `--bg`             | `#0D1117` | Fondo (estilo GitHub dark) |
| `--bg-surface`     | `#161B22` | Cards, superficies         |
| `--bg-elevated`    | `#21262D` | Cards elevadas             |
| `--text-primary`   | `#F0F6FC` | Títulos                    |
| `--text-secondary` | `#8B949E` | Cuerpo                     |
| `--border`         | `#30363D` | Bordes                     |
| `--accent`         | `#58A6FF` | Azul en dark mode          |

---

## Layout y espaciado

- **Estructura con sidebar en desktop:** Navbar lateral izquierda de 240px fija + contenido principal. En mobile: top navbar normal.
- **Contenedor máximo:** 960px (sidebar + contenido).
- **Grid de proyectos:** 2–3 columnas con cards uniformes. Sin asimetría.
- **Padding vertical entre secciones:** 80px.
- **Secciones alternas:** una sección sobre fondo `--bg`, la siguiente sobre `--bg-surface`. Da ritmo sin usar colores.

---

## Sección por sección

### Hero

- **Oscuro siempre**, independiente del modo (el hero tiene su propio fondo `--bg-dark`).
- Foto profesional circular con anillo de gradiente sutil.
- Nombre + cargo + empresa actual o "disponible para proyectos".
- 3–4 métricas en una fila: `5 años de exp.` / `23 proyectos` / `8 clientes` / `Available for hire ●` (punto verde animado).
- Botones: "Ver proyectos" (filled, azul) + "Descargar CV" (outlined).

### About

- Dos columnas: texto izquierda + cards de datos derecha.
- Cards de datos: valores grandes (número) + label debajo. Ej: `5+` / `años de experiencia`.
- Texto en prosa, no lista. 3–4 párrafos.

### Skills

- Agrupadas en tabs: `Frontend` / `Backend` / `DevOps` / `Soft Skills`.
- Cada skill: icono + nombre + nivel en texto (`Avanzado`, `Intermedio`). Sin barras de progreso numéricas.
- Grid 3–4 columnas por tab.

### Projects

- Tabs o filtros: `Todos` / `Frontend` / `Full-stack` / `Open Source`.
- Cada card: imagen + badge de categoría + título + descripción corta + links (GitHub, Live).
- Card al hover: elevación sutil (`box-shadow`), sin glow.
- Sin efectos dramáticos.

### Experience

- **Doble timeline:** izquierda Experiencia, derecha Educación. En columnas en desktop.
- Cada item: logo de empresa (si está disponible) + cargo + empresa + fechas + 2–3 bullets.
- Bullets con `•` o `—`, no emojis ni iconos fancy.

### Contact

- Formulario completo: nombre + email + asunto + mensaje.
- Labels encima de cada campo (no placeholder-only).
- Botón submit con estado loading.
- Sidebar de contacto alternativo: email directo + LinkedIn + GitHub como links con iconos.

---

## Animaciones y micro-interacciones

- **Entrada de secciones:** fade simple, duración 0.4s. Nada dramático.
- **Hover en cards:** `translateY(-3px)` + sombra más pronunciada.
- **Active state en sidebar:** el link de la sección activa tiene `border-left: 3px solid var(--accent)` + fondo `--accent-light`.
- **Punto verde en "Available":** pulso lento con `@keyframes pulse`, como un semáforo.
- **Sin cursor custom, sin partículas, sin efectos de texto.**

---

## Patrones y texturas

- Ninguna textura visible.
- El patrón es estructural: la división sidebar/contenido ya es el "patrón".
- Separadores: solo `border-top: 1px solid var(--border)`.

---

## Diferenciadores que lo hacen único

1. La navbar lateral en desktop es inusual en portafolios y comunica estructura de producto.
2. El hero siempre oscuro rompe con el ritmo del resto y hace la primera impresión fuerte.
3. La doble timeline (experiencia + educación) en paralelo es más informativa que la lista simple.
4. El verde de "disponible" es el único color llamativo — y tiene significado concreto.

---

---

# Tema 4 — Vaporwave

## Filosofía general

Este portafolio es una obra de arte interactiva. No sigue reglas de diseño corporativo porque las reglas fueron creadas antes del internet, antes de los monitores, antes de los sueños digitales. Cada sección es un "escenario": el usuario viaja a través de ambientes distintos mientras scrollea. Es irresistible, memorable, y completamente auténtico. Ideal para quien entiende que la personalidad es una ventaja competitiva, no un riesgo.

**Sensación al entrar:** nostalgia de un futuro que nunca existió. Maravilla. Curiosidad. "¿Quién hizo esto?"

---

## Tipografía

La tipografía mezcla épocas deliberadamente — serif de los 80s + sans moderna + display retro.

| Uso                           | Fuente                              | Estilo                      |
| ----------------------------- | ----------------------------------- | --------------------------- |
| H1 hero / títulos principales | `Bebas Neue` o `Anton`              | Regular, todo caps, enorme  |
| H2 secciones                  | `Viga` o `Righteous`                | Regular, con carácter retro |
| Cuerpo                        | `Space Grotesk`                     | Regular 400                 |
| Labels, metadata              | `Space Mono`                        | Con carácter de terminal    |
| Acento / citas                | `Dancing Script` o cursiva italiana | Para contraste inesperado   |

- **H1 hero:** 100–140px, todo caps, tracking 0. La escala lo es todo.
- **Body:** 15px, weight 400, line-height 1.7.
- **Técnica especial:** algunas palabras del H1 pueden tener `color: transparent; -webkit-text-stroke: 2px var(--accent)` — texto outline, estilo retro.

---

## Paleta de colores

### Modo oscuro (default y predominante)

| Token               | Valor                                   | Uso                          |
| ------------------- | --------------------------------------- | ---------------------------- |
| `--bg`              | `#1A0533`                               | Púrpura profundo             |
| `--bg-surface`      | `#2D0D5C`                               | Superficies, cards           |
| `--text-primary`    | `#F5E6FF`                               | Texto sobre fondo oscuro     |
| `--text-secondary`  | `#C4A0E8`                               | Texto secundario             |
| `--pink`            | `#FF2DAF`                               | Rosa neón principal          |
| `--cyan`            | `#00FFFF`                               | Cyan brillante               |
| `--yellow`          | `#FFE600`                               | Amarillo neón                |
| `--lavender`        | `#C77DFF`                               | Lavanda                      |
| `--gradient-sunset` | `#FF6B6B → #FF2DAF → #C77DFF → #4EA8DE` | Gradiente de sección hero    |
| `--grid-color`      | `rgba(0, 255, 255, 0.15)`               | Color de la cuadrícula retro |

### Modo claro

| Token            | Valor     | Uso                              |
| ---------------- | --------- | -------------------------------- |
| `--bg`           | `#FDF0FF` | Lavanda muy pálido               |
| `--bg-surface`   | `#FFFFFF` | Cards                            |
| `--text-primary` | `#2D0D5C` | Texto oscuro                     |
| `--pink`         | `#D1007A` | Rosa oscurecido para legibilidad |
| `--cyan`         | `#0096A0` | Cyan oscurecido                  |

---

## Layout y espaciado

- **Sin contenedor fijo:** cada sección usa su propio layout, que puede ser full-width o restringido.
- **Secciones como "escenas":** cada una tiene fondo, decoración y composición distintos.
- **Grid de proyectos:** cards con aspecto de VHS, cassettes, o cartuchos de videojuego.
- **Padding vertical:** variable — algunas secciones muy juntas para crear tensión, otras con mucho aire.
- **Elementos que rompen el layout:** imágenes o texto que sobresalen del contenedor, elementos que se superponen entre secciones.

---

## Sección por sección

### Hero

- **Fondo:** cuadrícula perspectiva (efecto "retrowave floor") animada con CSS — líneas que convergen al horizonte y se mueven lentamente.
- **Cielo:** gradiente sunset de abajo a arriba: `#0A0015 → #4A0080 → #FF2DAF → #FF8C42`.
- **Sol retro:** semicírculo con líneas horizontales superpuestas (el símbolo vaporwave por excelencia), en amarillo/naranja.
- **H1:** nombre en Bebas Neue, enorme, con sombra de color neón: `text-shadow: 0 0 30px var(--pink)`.
- **Subtítulo:** en Space Mono, pequeño, con efecto de cursor parpadeante.
- **Elemento flotante:** una palmera o estatua griega en silhouette (SVG) decorativa.
- **CTA:** botón con borde degradado animado (rainbow border).

### About

- **Fondo:** checker pattern (tablero de ajedrez) en tonos púrpura muy sutil.
- Foto con glitch effect al hover — duplicación de imagen con offset de color (CSS `filter: hue-rotate` + posición).
- Texto sobre una card que parece una ventana de Windows 95 — barra de título con botones de minimizar/cerrar decorativos.
- Cita personal en cursiva grande.

### Skills

- **Presentadas como "achievements" de videojuego:** cada skill tiene un icono de píxel art (o se pueden cargar desde devicons) + nombre + XP bar estilo RPG.
- La barra de XP tiene colores neón y animación al scroll.
- Layout tipo inventario de juego: grid de iconos cuadrados con tooltip al hover.

### Projects

- **Cards estilo VHS / cassette:**
  - Fondo de la card: textura oscura con pequeñas líneas de scanlines (CSS `repeating-linear-gradient`).
  - "Etiqueta" del cassette con el nombre del proyecto escrito a mano (fuente cursiva).
  - Esquinas redondeadas, aspecto plástico.
  - Al hover: efecto de "track" — pequeño glitch de imagen que se acomoda, como insertar el cassette.
  - Badge: `▶ PLAY` en verde para el link live, `</>` para GitHub.
- Fondo de sección: gradiente de neón suave.

### Experience

- Timeline presentada como una "línea de tiempo de internet" — estética de foro viejo o GeoCities.
- Cada trabajo en una "post card" con borde de píxeles (CSS `border-image` con patrón de píxeles).
- Fechas en Space Mono, grandes.
- Separadores con GIF decorativo pequeño (o pseudo-GIF con CSS animation) — estrella parpadeante, separador de `-·-·-`.

### Contact

- **Sección con estética de chat de IRC / AOL Instant Messenger.**
- Ventana de chat con título "you've got mail" o "new message from: [tu nombre]".
- Input estilizado como un campo de chat retro.
- Easter egg: si el usuario escribe algo y envía, respuesta automática con un mensaje gracioso.

---

## Animaciones y micro-interacciones

- **Cuadrícula del hero:** se mueve hacia el espectador en loop infinito (CSS `perspective` + `translateZ` en keyframes).
- **Entrada de secciones:** las cards de proyectos entran con efecto de "drop" — caen desde arriba con un ligero rebote (`cubic-bezier` con overshoot).
- **Glitch effect en títulos de sección:** al hacer hover, el texto se desplaza en rojo/cyan por 0.3s — efecto chromatic aberration.
- **Cursor custom:** cursor estilo "crosshair" retro, o un pixel cursor de 16x16.
- **Parallax sutil:** el sol del hero se mueve a velocidad diferente al resto al hacer scroll.
- **Stars background en footer:** pequeñas partículas blancas estáticas que parpadean lentamente.

---

## Patrones y texturas

Estos patrones se usan en secciones específicas, no en todas al mismo tiempo:

| Patrón                 | CSS / Técnica                                                                                       | Sección             |
| ---------------------- | --------------------------------------------------------------------------------------------------- | ------------------- |
| Cuadrícula perspectiva | `perspective` + líneas CSS animadas                                                                 | Hero                |
| Checker pattern        | `repeating-conic-gradient`                                                                          | About               |
| Scanlines              | `repeating-linear-gradient(transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)` | Cards de proyectos  |
| Starfield              | `box-shadow` con cientos de puntos (CSS trick) o canvas                                             | Footer / Contact    |
| Noise grain            | Pseudo-elemento con `opacity: 0.04`, patrón SVG                                                     | About, Experience   |
| Pixel border           | `border-image` con SVG de 3x3 píxeles                                                               | Cards de Experience |

---

## Diferenciadores que lo hacen único

1. La cuadrícula perspectiva animada en el hero es la imagen más reconocible del tema — nadie la olvida.
2. Las cards de proyectos como cassettes VHS son únicas en el mundo de los portafolios de dev.
3. El contraste entre una fuente de 140px y metadata en 11px Space Mono crea tensión visual perfecta.
4. La sección de contact como ventana de AIM/IRC es el "momento" que hace que la gente comparta el portafolio.
5. El glitch effect solo en hover es suficiente — no todo el tiempo, o se vuelve ruido.

---

---

# Tabla resumen de diferencias reales entre temas

|                         | Minimalista                   | Modern Tech                  | Profesional                   | Vaporwave                           |
| ----------------------- | ----------------------------- | ---------------------------- | ----------------------------- | ----------------------------------- |
| **Ancho de contenedor** | 720px                         | 1100px                       | 960px + sidebar               | Full-width por sección              |
| **Fuente de títulos**   | Serif (Playfair)              | Grotesk bold (Space Grotesk) | Sans moderna (Plus Jakarta)   | Display retro (Bebas Neue)          |
| **Fondo hero**          | Blanco vacío                  | Partículas + grid oscuro     | Oscuro sólido                 | Cuadrícula perspectiva animada      |
| **Grid de proyectos**   | 2 columnas limpias            | Bento asimétrico             | Grid uniforme con filtros     | Cards tipo VHS                      |
| **Skills**              | Lista de texto plano          | Barras estilo terminal       | Tabs + iconos + nivel         | RPG inventory + XP bars             |
| **Timeline**            | Línea vertical delgada        | Horizontal, nodos neón       | Doble columna (exp + edu)     | Postcards estilo GeoCities          |
| **Contact**             | Email como texto grande       | Terminal simulada            | Formulario completo + sidebar | Ventana de chat retro (AIM)         |
| **Cursor**              | Default                       | Custom (punto + anillo)      | Default                       | Pixel cursor retro                  |
| **Animaciones**         | Fade + translateY suave       | Glow, blur, typewriter       | Fade mínimo                   | Glitch, drop con rebote, parallax   |
| **Decoración**          | Ninguna                       | Grid pattern + noise         | Ninguna                       | Checkers, scanlines, starfield, sol |
| **Cantidad de colores** | 1 (monocromático)             | 3 acentos neón               | 1 acento (azul)               | 4–5 neones                          |
| **Modo predominante**   | Claro                         | Oscuro                       | Claro (hero oscuro)           | Oscuro                              |
| **Vibe**                | Galería de arte contemporáneo | Dashboard de misión crítica  | Producto de software maduro   | Instalación artística interactiva   |
