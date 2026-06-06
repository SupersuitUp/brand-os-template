#!/usr/bin/env python3
"""
Compose the POV DTX wordmark lockups as self-contained SVG:
  PoV [🤠 mark] DTX  in Luckiest Guy, ink, with the signature double
  marker underline (red over cobalt). The cowboy-smiley mark is embedded
  as base64 so the SVG is portable. Layout is measured with PIL font
  metrics so the emoji-as-heart sits perfectly centered.

Outputs SVGs to logos/svg/ and PNG renders to logos/raster/ (via rsvg-convert).
Run from repo root.
"""
import os, base64, subprocess
from PIL import ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SVG = os.path.join(ROOT, "logos", "svg");  os.makedirs(SVG, exist_ok=True)
RAS = os.path.join(ROOT, "logos", "raster"); os.makedirs(RAS, exist_ok=True)

INK   = "#1E1B17"; CREAM = "#F4ECD8"; RED = "#E23B2E"; COBALT = "#1E63D0"
FONT_DISPLAY = os.path.join(ROOT, "fonts", "LuckiestGuy-Regular.ttf")
FONT_HAND    = os.path.join(ROOT, "fonts", "PermanentMarker-Regular.ttf")
MARK_PNG     = os.path.join(ROOT, "logos", "raster", "mark-color.png")

with open(MARK_PNG, "rb") as f:
    MARK_B64 = base64.b64encode(f.read()).decode()
MARK_HREF = f"data:image/png;base64,{MARK_B64}"

def text_w(text, ttf, size):
    font = ImageFont.truetype(ttf, size)
    box = font.getbbox(text)
    return box[2] - box[0]

def write(name, svg):
    p = os.path.join(SVG, name)
    with open(p, "w") as f:
        f.write(svg)
    out = os.path.join(RAS, name.replace(".svg", ".png"))
    subprocess.run(["rsvg-convert", "-w", "2000", "-o", out, p], check=True)
    print("  ", os.path.relpath(p, ROOT), "->", os.path.relpath(out, ROOT))

FS = 200                       # display font size
GAP = 28                       # gap between text and mark
MARK = 230                     # mark render size in lockup
pov_w = text_w("PoV", FONT_DISPLAY, FS)
dtx_w = text_w("DTX", FONT_DISPLAY, FS)
total = pov_w + GAP + MARK + GAP + dtx_w
PAD = 90
Wd = total + 2*PAD
baseline = 250
mark_y = baseline - MARK + 28   # nudge mark to sit on the cap line

x = PAD
pov_x = x
x += pov_w + GAP
mark_x = x
x += MARK + GAP
dtx_x = x

FONT_FACE = f"""
  <defs><style>
    @font-face {{ font-family:'Luckiest Guy'; src:url('data:font/ttf;base64,{base64.b64encode(open(FONT_DISPLAY,'rb').read()).decode()}') format('truetype'); }}
    @font-face {{ font-family:'Permanent Marker'; src:url('data:font/ttf;base64,{base64.b64encode(open(FONT_HAND,'rb').read()).decode()}') format('truetype'); }}
  </style></defs>"""

# Underline geometry: two marker strokes under the whole wordmark
ul_y = baseline + 34
under = f"""
  <path d="M {pov_x-6} {ul_y} Q {Wd/2} {ul_y+14}, {dtx_x+dtx_w+6} {ul_y-2}" stroke="{COBALT}" stroke-width="14" fill="none" stroke-linecap="round"/>
  <path d="M {pov_x+10} {ul_y+22} Q {Wd/2} {ul_y+34}, {dtx_x+dtx_w-10} {ul_y+18}" stroke="{RED}" stroke-width="11" fill="none" stroke-linecap="round"/>"""

def wordmark(bg, ink, fname, with_under=True):
    bg_rect = f'<rect width="{Wd}" height="360" fill="{bg}"/>' if bg else ""
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{Wd}" height="360" viewBox="0 0 {Wd} 360">{FONT_FACE}
  {bg_rect}
  <text x="{pov_x}" y="{baseline}" font-family="Luckiest Guy" font-size="{FS}" fill="{ink}">PoV</text>
  <image href="{MARK_HREF}" x="{mark_x}" y="{mark_y}" width="{MARK}" height="{MARK}"/>
  <text x="{dtx_x}" y="{baseline}" font-family="Luckiest Guy" font-size="{FS}" fill="{ink}">DTX</text>
  {under if with_under else ""}
</svg>'''
    write(fname, svg)

# A. Primary lockup — transparent
wordmark(None, INK, "wordmark-primary.svg")
# B. On cream
wordmark(CREAM, INK, "wordmark-on-cream.svg")
# C. Knockout on dark
wordmark(INK, CREAM, "wordmark-knockout-on-dark.svg")

# D. Horizontal lockup WITH tagline (stacked under the wordmark)
tag = "The best of Dallas you'd never find on your own."
tfs = 46
Wd2 = Wd
svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{Wd2}" height="470" viewBox="0 0 {Wd2} 470">{FONT_FACE}
  <rect width="{Wd2}" height="470" fill="{CREAM}"/>
  <text x="{pov_x}" y="{baseline}" font-family="Luckiest Guy" font-size="{FS}" fill="{INK}">PoV</text>
  <image href="{MARK_HREF}" x="{mark_x}" y="{mark_y}" width="{MARK}" height="{MARK}"/>
  <text x="{dtx_x}" y="{baseline}" font-family="Luckiest Guy" font-size="{FS}" fill="{INK}">DTX</text>
  {under}
  <text x="{Wd2/2}" y="430" text-anchor="middle" font-family="Permanent Marker" font-size="{tfs}" fill="{COBALT}">{tag}</text>
</svg>'''
write("lockup-horizontal-tagline.svg", svg)

# E. Stacked badge — mark on top, PoV DTX beneath, tagline under
povdtx_w = text_w("PoV DTX", FONT_DISPLAY, 150)
Wb = max(povdtx_w, 520) + 2*PAD
svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{Wb}" height="560" viewBox="0 0 {Wb} 560">{FONT_FACE}
  <rect width="{Wb}" height="560" rx="40" fill="{CREAM}"/>
  <image href="{MARK_HREF}" x="{(Wb-300)/2}" y="36" width="300" height="300"/>
  <text x="{Wb/2}" y="470" text-anchor="middle" font-family="Luckiest Guy" font-size="150" fill="{INK}">PoV DTX</text>
  <path d="M {Wb/2-povdtx_w/2-6} 500 Q {Wb/2} 514, {Wb/2+povdtx_w/2+6} 498" stroke="{COBALT}" stroke-width="12" fill="none" stroke-linecap="round"/>
  <path d="M {Wb/2-povdtx_w/2+8} 520 Q {Wb/2} 532, {Wb/2+povdtx_w/2-8} 516" stroke="{RED}" stroke-width="9" fill="none" stroke-linecap="round"/>
</svg>'''
write("lockup-stacked-badge.svg", svg)

print("Wordmark lockups built.")
