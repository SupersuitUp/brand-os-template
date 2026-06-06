#!/usr/bin/env python3
"""
Build the POV DTX logo raster matrix + crops from the two approved masters:
  - logo-mark-cowboy-smiley.png  (full-color illustrated mark, on cream)
  - logo-mark-linestamp-black.png (clean black single-color line stamp)

Produces transparent mono + knockout marks, light/dark preview grounds,
favicons, social avatar, and an OG lockup. Run from repo root.
"""
import os
from PIL import Image, ImageOps, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
RAS = os.path.join(ROOT, "logos", "raster")
CROP = os.path.join(ROOT, "logos", "crops")
os.makedirs(RAS, exist_ok=True)
os.makedirs(CROP, exist_ok=True)

GROUND = (244, 236, 216, 255)   # #F4ECD8 cream
DARK   = (30, 27, 23, 255)      # #1E1B17 ink

color_master = Image.open(os.path.join(RAS, "mark-color-on-cream.png")).convert("RGBA")
line_master  = Image.open(os.path.join(RAS, "mark-linestamp-black.png")).convert("L")

# --- 1. Color mark masters ---------------------------------------------------
color_master.save(os.path.join(RAS, "mark-color-on-cream.png"))

# --- 2. From the line stamp: build clean mono + knockout w/ transparency -----
# Threshold the line art to crisp black/white
bw = line_master.point(lambda p: 0 if p < 128 else 255, mode="L")
W, H = bw.size

# MONO INK: black shapes, transparent where white
mono = Image.new("RGBA", (W, H), (0, 0, 0, 0))
px_bw = bw.load(); px_m = mono.load()
for y in range(H):
    for x in range(W):
        if px_bw[x, y] < 128:
            px_m[x, y] = (30, 27, 23, 255)   # ink
mono.save(os.path.join(RAS, "mark-mono-ink.png"))

# KNOCKOUT: white shapes, transparent where white-ground (for dark grounds)
knock = Image.new("RGBA", (W, H), (0, 0, 0, 0))
px_k = knock.load()
for y in range(H):
    for x in range(W):
        if px_bw[x, y] < 128:
            px_k[x, y] = (255, 255, 255, 255)
knock.save(os.path.join(RAS, "mark-knockout-white.png"))

# --- 3. Preview grounds ------------------------------------------------------
def on_ground(fg, ground_rgba, name, pad_ratio=0.14):
    side = max(fg.size)
    pad = int(side * pad_ratio)
    canvas = Image.new("RGBA", (side + 2*pad, side + 2*pad), ground_rgba)
    canvas.alpha_composite(fg, (pad + (side-fg.size[0])//2, pad + (side-fg.size[1])//2))
    canvas.convert("RGB").save(os.path.join(RAS, name))

on_ground(mono,  GROUND, "mark-mono-on-light.png")
on_ground(knock, DARK,   "mark-knockout-on-dark.png")

# --- 4. Crops: favicons + avatar --------------------------------------------
# Square the color master (it is already ~square); resize for favicons/avatar.
sq = color_master.copy()
s = min(sq.size); sq = sq.crop(((sq.size[0]-s)//2, (sq.size[1]-s)//2,
                                (sq.size[0]-s)//2 + s, (sq.size[1]-s)//2 + s))
for px in (512, 192, 32):
    sq.resize((px, px), Image.LANCZOS).convert("RGBA").save(os.path.join(CROP, f"favicon-{px}.png"))
# Multi-res .ico
sq.resize((256,256), Image.LANCZOS).save(os.path.join(CROP, "favicon.ico"),
          sizes=[(16,16),(32,32),(48,48),(64,64),(128,128),(256,256)])
# Social avatar (1024 square)
sq.resize((1024,1024), Image.LANCZOS).convert("RGB").save(os.path.join(CROP, "avatar-1024.png"))

print("Logo raster matrix + crops built ->", RAS, "and", CROP)
for d in (RAS, CROP):
    for f in sorted(os.listdir(d)):
        print(" ", os.path.relpath(os.path.join(d,f), ROOT))
