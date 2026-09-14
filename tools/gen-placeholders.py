#!/usr/bin/env python3
"""
Generador de placeholders fotograficos de Sunday Funday.

Crea SVG ligeros, con la paleta de la marca, claramente marcados como
"FOTO PENDIENTE" para que se reemplacen por fotografia real en WebP.

Uso:  python3 tools/gen-placeholders.py
Salida: assets/img/*.svg

Cuando lleguen las fotos reales:
  1. guardar los originales en assets/photos/source/
  2. convertirlos a WebP en assets/img/ con el mismo nombre base
  3. cambiar la extension .svg por .webp en lib/manifest.js y en el HTML
"""

import math
import random
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "img"
OUT.mkdir(parents=True, exist_ok=True)

# Paleta Sunday Funday (espejo de los tokens de styles.css)
PAL = {
    "crema":     ("#F7E9DA", "#E9D2B8", "#C08B55"),
    "fresa":     ("#FFE4E8", "#FFC2CD", "#E14361"),
    "mango":     ("#FFF0D2", "#FFDCA0", "#F2A33C"),
    "pistacho":  ("#E7F3E2", "#C9E4C2", "#5E9E6E"),
    "mora":      ("#F3E4EF", "#DEC2D6", "#7B3F6B"),
    "cacao":     ("#F2E6DC", "#DCC3AE", "#7A4F32"),
    "azul":      ("#DCE8FF", "#B4CCFF", "#2E6BE6"),
}
TINTA = "#2C1A14"

SPRINKLE_COLORS = ["#E14361", "#F2A33C", "#5E9E6E", "#7B3F6B", "#2E6BE6"]


def sprinkles(w, h, seed, n=14, opacity=0.45):
    """Grageas: rectangulos redondeados rotados, repartidos de forma estable."""
    rng = random.Random(seed)
    out = []
    for _ in range(n):
        x = rng.uniform(0.06, 0.94) * w
        y = rng.uniform(0.08, 0.92) * h
        rot = rng.uniform(0, 180)
        long_side = rng.uniform(0.018, 0.030) * min(w, h)
        short_side = long_side * 0.34
        color = rng.choice(SPRINKLE_COLORS)
        out.append(
            f'<rect x="{x:.1f}" y="{y:.1f}" width="{long_side:.1f}" height="{short_side:.1f}" '
            f'rx="{short_side/2:.1f}" fill="{color}" opacity="{opacity}" '
            f'transform="rotate({rot:.1f} {x:.1f} {y:.1f})"/>'
        )
    return "".join(out)


def swirl(cx, cy, r, color, opacity=1.0):
    """Silueta de helado suave: tres vueltas decrecientes + punta."""
    parts = []
    turns = [(1.0, 0.0), (0.72, -0.72), (0.46, -1.26)]
    for k, (scale, dy) in enumerate(turns):
        rr = r * scale
        cyy = cy + dy * r
        parts.append(
            f'<path d="M {cx-rr:.1f} {cyy:.1f} '
            f'a {rr:.1f} {rr*0.86:.1f} 0 0 1 {rr*2:.1f} 0 '
            f'l 0 {rr*0.40:.1f} '
            f'a {rr:.1f} {rr*0.40:.1f} 0 0 1 {-rr*2:.1f} 0 Z" '
            f'fill="{color}" opacity="{opacity - k*0.06:.2f}"/>'
        )
    tip_r = r * 0.30
    tip_y = cy - 1.26 * r - tip_r * 0.55
    parts.append(
        f'<path d="M {cx-tip_r:.1f} {tip_y:.1f} '
        f'Q {cx:.1f} {tip_y - tip_r*1.9:.1f} {cx+tip_r:.1f} {tip_y:.1f} Z" '
        f'fill="{color}" opacity="{opacity - 0.18:.2f}"/>'
    )
    return "".join(parts)


def label(w, h, text):
    """Etiqueta honesta en la esquina: esto todavia no es una foto real."""
    short = min(w, h)
    pad = short * 0.055
    fs = max(11.0, short * 0.030)
    box_h = fs * 2.35
    box_w = min(w - pad * 2, fs * (len(text) * 0.62 + 3.2))
    bx = (w - box_w) / 2          # centrada: sobrevive al recorte de object-fit
    by = h - pad - box_h
    ty = by + box_h / 2 + fs * 0.36
    dot_cx = bx + box_h * 0.50
    return (
        f'<g opacity="0.92">'
        f'<rect x="{bx:.1f}" y="{by:.1f}" width="{box_w:.1f}" height="{box_h:.1f}" '
        f'rx="{box_h/2:.1f}" fill="{TINTA}"/>'
        f'<circle cx="{dot_cx:.1f}" cy="{by + box_h/2:.1f}" r="{fs*0.30:.1f}" fill="#FFF7EE"/>'
        f'<text x="{dot_cx + fs*0.62:.1f}" y="{ty:.1f}" fill="#FFF7EE" '
        f'font-family="Montserrat, Verdana, sans-serif" font-size="{fs:.1f}" '
        f'font-weight="600" letter-spacing="{fs*0.06:.2f}">{text}</text>'
        f'</g>'
    )


def make(name, w, h, pal_key, caption, seed=None, n_sprinkles=14):
    light, mid, deep = PAL[pal_key]
    seed = seed if seed is not None else sum(ord(c) for c in name)
    gid = f"g-{name}"

    # Composicion: lavado diagonal + dos manchas suaves + swirl + grageas
    cx, cy, r = w * 0.5, h * 0.78, min(w, h) * 0.26
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" role="img">
<defs>
<linearGradient id="{gid}" x1="0" y1="0" x2="0.85" y2="1">
<stop offset="0" stop-color="{light}"/><stop offset="1" stop-color="{mid}"/>
</linearGradient>
<radialGradient id="{gid}-h" cx="0.28" cy="0.22" r="0.7">
<stop offset="0" stop-color="#FFFFFF" stop-opacity="0.85"/>
<stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
</radialGradient>
</defs>
<rect width="{w}" height="{h}" fill="url(#{gid})"/>
<circle cx="{w*0.80:.0f}" cy="{h*0.22:.0f}" r="{min(w,h)*0.30:.0f}" fill="{deep}" opacity="0.14"/>
<circle cx="{w*0.18:.0f}" cy="{h*0.62:.0f}" r="{min(w,h)*0.20:.0f}" fill="{deep}" opacity="0.09"/>
<rect width="{w}" height="{h}" fill="url(#{gid}-h)"/>
{swirl(cx, cy, r, deep, 0.30)}
{sprinkles(w, h, seed, n_sprinkles)}
{label(w, h, caption)}
</svg>"""
    (OUT / f"{name}.svg").write_text(svg, encoding="utf-8")
    return name


# name, ancho, alto, paleta, etiqueta
SPECS = [
    ("hero",               1200, 1500, "fresa",    "FOTO PENDIENTE · HERO"),
    ("hero-detalle",        900, 1200, "mango",    "FOTO PENDIENTE · VITRINA"),
    ("funday",              900, 1200, "fresa",    "FOTO PENDIENTE · FUNDAY"),
    ("sundae",              900,  900, "mora",     "FOTO PENDIENTE · SUNDAE"),
    ("ensalada-frutas",    1400, 1050, "mango",    "FOTO PENDIENTE · ENSALADA"),
    ("ensalada-detalle",    900,  900, "pistacho", "FOTO PENDIENTE · ENSALADA"),
    ("aventura-azul",      1200, 1200, "azul",     "FOTO PENDIENTE · AVENTURA AZUL"),
    ("aventura-detalle",    800, 1000, "azul",     "FOTO PENDIENTE · DETALLE"),
    ("cafe",                900, 1200, "cacao",    "FOTO PENDIENTE · CAFE"),
    ("malteada",           1600,  900, "fresa",    "FOTO PENDIENTE · MALTEADA"),
    ("cono-suave",          800, 1000, "crema",    "FOTO PENDIENTE · CONO"),
    ("parfait",             800, 1000, "mora",     "FOTO PENDIENTE · PARFAIT"),
    ("brownie",             900,  900, "cacao",    "FOTO PENDIENTE · BROWNIE"),
    ("fresas-chocolate",    900,  900, "fresa",    "FOTO PENDIENTE · FRESAS"),
    ("affogato",            800, 1000, "cacao",    "FOTO PENDIENTE · AFFOGATO"),
    ("oblea",               900,  900, "crema",    "FOTO PENDIENTE · OBLEA"),
    ("torta-almojabana",    900,  900, "mango",    "FOTO PENDIENTE · TORTA"),
    ("local-mesas",        1680,  720, "cacao",    "FOTO PENDIENTE · EL LOCAL"),
    ("local-vitrina",       900,  700, "mango",    "FOTO PENDIENTE · VITRINA"),
    ("familia",             900,  700, "pistacho", "FOTO PENDIENTE · EQUIPO"),
    ("mapa",               1200,  800, "pistacho", "MAPA PENDIENTE · EMBED"),
    ("og-cover",           1200,  630, "fresa",    "FOTO PENDIENTE · PORTADA"),
]

for spec in SPECS:
    make(*spec)

print(f"{len(SPECS)} placeholders generados en {OUT.relative_to(ROOT)}")
