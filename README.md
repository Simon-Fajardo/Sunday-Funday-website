# Sunday Funday · sitio web

Sitio estático de **Sunday Funday**, heladería y café de familia en Nariño Sur, Bogotá.
Sin frameworks, sin compilación, sin dependencias que instalar: se abre y funciona.

---

## 1. Cómo verlo

**Opción rápida:** doble clic en `index.html`. Funciona tal cual, también sin servidor.

**Opción recomendada** (más fiel a cómo se verá publicado):

```bash
cd sunday-funday-website
python3 -m http.server 8000
```

y abrir `http://localhost:8000`.

Si tras un cambio el navegador parece mostrar la versión anterior, recarga forzando
(`Ctrl+Shift+R` / `Cmd+Shift+R`).

---

## 2. Lo primero que hay que rellenar

Todos los datos del negocio están en **un solo archivo**: `lib/manifest.js`.
Reemplaza los valores entre corchetes y se actualizan solos los enlaces de las dos páginas.

| Campo | Qué poner | Dónde se usa |
|---|---|---|
| `whatsapp` | Solo dígitos con indicativo, p. ej. `573001234567` | Botones de WhatsApp, barra móvil, pie |
| `instagram` | Usuario sin arroba, p. ej. `sundayfunday` | Tarjeta de Instagram, pie |
| `mapsUrl` | Enlace del perfil en Google Maps | Tarjeta de Google Maps |
| `mapsDirecciones` | Enlace de *Indicaciones* de Google Maps | Todos los botones **Cómo llegar** |
| `mapaEmbedUrl` | Solo la URL de dentro de `src="..."` en *Compartir → Insertar un mapa* | Sustituye el marcador del mapa por el mapa real |
| `local.direccion` | Dirección completa | Sección Ubicación y pie |
| `local.horario` | Horario de atención | Sección Ubicación y pie |

Lo que no se rellene se queda a la vista como `[PLACEHOLDER]`. Es a propósito:
así nadie publica la web con datos inventados.

### Lo que queda pendiente fuera de `manifest.js`

- **Precios.** Aparecen como `[PRECIO]` en `index.html` (sección menú) y en `menu.html`.
  Sustituye cada uno por su importe; el diseño de la ficha ya está listo para recibirlo.
- **URL del sitio.** Cuando haya dominio, descomenta las etiquetas `canonical` y `og:url`
  al inicio de `index.html` y `menu.html`.
- **Schema de negocio local.** En `index.html` hay un comentario `PENDIENTE` con la lista
  exacta de campos que faltan (dirección exacta, teléfono, coordenadas, horarios, Instagram).
  No se han rellenado con aproximaciones a propósito: Google penaliza los datos inexactos.
- **Imagen para compartir.** `assets/img/og-cover.svg` debe pasar a ser una foto real
  de 1200 × 630 px en `.jpg`, y actualizar la etiqueta `og:image`.

---

## 3. Las fotografías

**Todas las imágenes actuales son marcadores.** Son SVG con la paleta de la marca
y una etiqueta visible «FOTO PENDIENTE», para que nadie los confunda con producto real.

Para sustituirlos:

1. Guarda los originales en `assets/photos/source/`.
2. Conviértelos a WebP (calidad 80–85 va bien) y déjalos en `assets/img/` con el
   **mismo nombre base**: `funday.webp`, `ensalada-frutas.webp`, `hero.webp`…
3. Cambia la extensión `.svg` por `.webp` en `index.html` y `menu.html`
   (`grep -n "assets/img" index.html menu.html` los lista todos).
4. Actualiza el `alt` de cada imagen: ahora dice «Espacio reservado para…»;
   debe describir lo que realmente se ve.

Proporciones a las que están diseñados los huecos:

| Archivo | Proporción | Dónde aparece |
|---|---|---|
| `hero` | 4:5 vertical | Foto principal de portada |
| `hero-detalle` | 3:4 vertical | Foto pequeña superpuesta en la portada |
| `funday` | 3:4 vertical | Favorito 01 y carta |
| `ensalada-frutas` | 4:3 | Favorito 02, sección ensalada y carta |
| `sundae` | 1:1 | Favorito 03 |
| `aventura-azul` | 1:1 | Favorito 04, sección Aventura Azul y carta |
| `cafe` | 3:4 vertical | Favorito 05 y carta |
| `malteada` | 16:9 | Favorito 06 y carta |
| `local-mesas` | 16:9 | Sección Experiencia |
| `familia` | 5:4 | Sección Nosotros |
| `cono-suave`, `brownie`, `aventura-detalle`, `ensalada-detalle` | varias | Carta y detalles |

Los marcadores se pueden regenerar en cualquier momento con
`python3 tools/gen-placeholders.py` (la carpeta `tools/` no forma parte del sitio:
puedes ignorarla o borrarla al entregar).

---

## 4. Dirección de arte

La idea: **«todos los días saben a domingo»**. Crema de vainilla de fondo, tinta de
chocolate para el texto, y los acentos tomados de los propios productos.

**Paleta** (tokens al inicio de `styles.css`, todos modificables desde un sitio):

| Token | Color | Uso |
|---|---|---|
| `--crema` / `--crema-2` / `--crema-3` | `#FFF7EE` `#F9EDE0` `#F2DFCB` | Fondos |
| `--tinta` / `--tinta-2` / `--tinta-3` | `#2C1A14` `#6B534A` `#7E675E` | Texto |
| `--fresa` / `--fresa-ink` | `#E14361` `#B32444` | Acento principal, botones |
| `--mango` | `#F2A33C` | Acento cálido |
| `--pistacho` | `#5E9E6E` | Sección de fruta |
| `--azul` | `#2A61D6` | **Solo** Aventura Azul |

**Tipografía:** Montserrat (400–800) para todo el cuerpo y los titulares, y Fraunces en
cursiva —con los ejes `SOFT` y `WONK` al máximo— para las palabras destacadas. La mezcla
de las dos dentro del mismo titular es la firma tipográfica del sitio.

**Formas propias:**

- **El domo** — las fotos principales llevan la silueta de una bola de helado suave
  (`--domo`). No es una tarjeta redondeada más.
- **El goteo** — la transición entre bloques de color no es una línea recta: chorrea,
  como un helado que se derrite. Es el elemento que hace la web reconocible.
- **El remolino** — la marca es la espiral del helado suave. Se repite en el logo,
  el favicon, el sello y la cinta de sabores.

**Animación** — cinco sistemas y ni uno más:

1. Aparición de bloques al hacer scroll.
2. Parallax de ±28 px como mucho en las fotos secundarias.
3. Microinteracciones en botones, tarjetas y navegación.
4. Cinta de sabores en movimiento continuo.
5. Pestañas del menú, panel móvil y barra flotante.

---

## 5. Estructura

```
sunday-funday-website/
├── index.html              Portada
├── menu.html               Carta completa
├── styles.css              Hoja de estilos única, por secciones
├── main.js                 Interacción (IIFE, sin módulos)
├── lib/
│   ├── manifest.js         ← los datos del negocio se editan aquí
│   ├── gsap.min.js         Solo para el parallax
│   └── ScrollTrigger.min.js
├── assets/
│   ├── favicon.svg
│   ├── img/                Marcadores (se sustituyen por WebP)
│   └── photos/source/      Originales de las fotos (no se publica)
├── tools/
│   └── gen-placeholders.py Generador de marcadores (no forma parte del sitio)
└── README.md
```

---

## 6. Decisiones técnicas

- **Sin React, sin build, sin npm.** Es una web de dos páginas: cualquier compilación
  sería peso muerto y una barrera para mantenerla.
- **El contenido vive en el HTML.** Sin JavaScript se ven las dos páginas enteras,
  los 24 productos del menú y todos los datos de contacto. JavaScript solo añade
  las pestañas, las animaciones y la barra flotante.
- **Scroll nativo, sin Lenis.** El sitio pide carga rápida por encima de inercia
  estilo Mac, y el scroll suave nativo (`scroll-behavior`) se comporta igual en todos
  los sistemas. Por eso `lib/` no incluye `lenis.min.js`.
- **GSAP solo para el parallax.** Si no cargara, la web sigue funcionando entera.
- **`prefers-reduced-motion`** apaga lo intrusivo (el sello que gira, el parallax)
  y conserva lo funcional (aparición de bloques, hover de botones, la cinta).
- **Accesibilidad:** todo el texto cumple contraste WCAG AA, hay enlace de salto,
  anillo de foco visible en los 34 elementos enfocables, el panel móvil atrapa el foco
  y se cierra con `Escape`, y las pestañas del menú se manejan con las flechas.

---

## 7. Comprobado

Chromium 1440×900 y 390×844: sin errores de consola, sin peticiones fallidas,
sin desbordes horizontales, funcionando por `http://` y por `file://`,
con y sin JavaScript, y con movimiento reducido activado.
