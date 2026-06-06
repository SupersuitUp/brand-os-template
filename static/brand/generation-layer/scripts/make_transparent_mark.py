#!/usr/bin/env python3
"""
Make a transparent-background version of the full-color mark by flood-filling
the outer cream ground and the contiguous white sticker ring to alpha=0,
preserving the character's interior whites (teeth, highlights). Run from repo root.
"""
import os
from collections import deque
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
src = Image.open(os.path.join(ROOT, "logos", "raster", "mark-color-on-cream.png")).convert("RGBA")
W, H = src.size
px = src.load()

def near(c, target, tol):
    return all(abs(c[i]-target[i]) <= tol for i in range(3))

# BFS flood from all 4 corners; clear pixels that are cream OR white (outer ring)
visited = bytearray(W*H)
q = deque()
for sx, sy in [(0,0),(W-1,0),(0,H-1),(W-1,H-1)]:
    q.append((sx,sy))
cleared = 0
while q:
    x, y = q.popleft()
    if x < 0 or y < 0 or x >= W or y >= H: continue
    idx = y*W + x
    if visited[idx]: continue
    visited[idx] = 1
    r,g,b,a = px[x,y]
    # outer ground = cream(#F4ECD8) or near-white sticker ring
    if near((r,g,b), (244,236,216), 36) or near((r,g,b), (255,255,255), 26):
        px[x,y] = (0,0,0,0)
        cleared += 1
        q.append((x+1,y)); q.append((x-1,y)); q.append((x,y+1)); q.append((x,y-1))

out = os.path.join(ROOT, "logos", "raster", "mark-color.png")
src.save(out)
print(f"cleared {cleared} px -> {os.path.relpath(out, ROOT)}")
