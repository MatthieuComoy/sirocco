"""Regenerates every app icon/favicon from the SVG masters in icons/src/.

The masters are hand-authored vector art (clean bezier curves, real
gradients, native anti-aliasing) rasterized to each required size with
`rsvg-convert`. The multi-resolution favicon.ico is assembled from those
PNGs with ImageMagick. This keeps the icon set reproducible without baking
pixel art by hand: edit the SVGs in icons/src/, rerun this script.

Requires: rsvg-convert (librsvg) and ImageMagick (`magick` or `convert`) on PATH.
"""

import os
import shutil
import subprocess
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC_DIR = os.path.join(ROOT, "icons", "src")
OUT_DIR = os.path.join(ROOT, "icons")

MASTER = os.path.join(SRC_DIR, "icon-master.svg")        # solid brand background
MASKABLE = os.path.join(SRC_DIR, "icon-maskable.svg")     # same art, shrunk to the safe zone
TRANSPARENT = os.path.join(SRC_DIR, "icon-transparent.svg")  # transparent background
MONO = os.path.join(SRC_DIR, "icon-mono.svg")             # flat silhouette, tiny sizes


def _find_tool(*names):
    for name in names:
        path = shutil.which(name)
        if path:
            return path
    return None


RSVG = _find_tool("rsvg-convert")
MAGICK = _find_tool("magick", "convert")

if not RSVG:
    sys.exit("rsvg-convert not found on PATH (install librsvg).")
if not MAGICK:
    sys.exit("ImageMagick (magick/convert) not found on PATH.")


def render(svg_path, size, out_path):
    subprocess.run(
        [RSVG, svg_path, "-w", str(size), "-h", str(size), "-o", out_path],
        check=True,
    )


os.makedirs(OUT_DIR, exist_ok=True)

# 1. PWA icons — "any" purpose (full-bleed) and "maskable" purpose (art shrunk
#    to the centered safe zone so adaptive-icon masks on Android don't clip it)
render(MASTER, 512, os.path.join(OUT_DIR, "icon-512.png"))
render(MASTER, 192, os.path.join(OUT_DIR, "icon-192.png"))
render(MASKABLE, 512, os.path.join(OUT_DIR, "icon-512-maskable.png"))
render(MASKABLE, 192, os.path.join(OUT_DIR, "icon-192-maskable.png"))

# 2. Apple touch icon (solid background required, 180x180)
render(MASTER, 180, os.path.join(OUT_DIR, "apple-touch-icon.png"))

# 3. MS tile icon (transparent background, 150x150 — tile colour set separately)
render(TRANSPARENT, 150, os.path.join(OUT_DIR, "mstile-150x150.png"))

# 4. Favicon PNGs (flat colour on transparent — reads cleanly at tiny sizes)
render(MONO, 32, os.path.join(OUT_DIR, "favicon-32x32.png"))
render(MONO, 16, os.path.join(OUT_DIR, "favicon-16x16.png"))

# 5. favicon.ico (multi-resolution: 16/32/48, built from the mono master)
tmp_16 = os.path.join(OUT_DIR, "_ico16.png")
tmp_32 = os.path.join(OUT_DIR, "_ico32.png")
tmp_48 = os.path.join(OUT_DIR, "_ico48.png")
render(MONO, 16, tmp_16)
render(MONO, 32, tmp_32)
render(MONO, 48, tmp_48)
subprocess.run([MAGICK, tmp_16, tmp_32, tmp_48, os.path.join(OUT_DIR, "favicon.ico")], check=True)
for tmp in (tmp_16, tmp_32, tmp_48):
    os.remove(tmp)

# 6. Safari pinned-tab mask icon is hand-authored directly at icons/safari-pinned-tab.svg
#    (must stay a single monochrome shape — Safari recolors it itself).

print("All icons (PWA, Apple, Favicons, MSTile, favicon.ico) regenerated from icons/src/*.svg.")
