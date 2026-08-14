from collections import Counter, deque
from pathlib import Path
import shutil

import numpy as np
from PIL import Image, ImageFilter


INPUT = Path(r"C:\Users\vince\WorkBuddy\2026-08-07-08-52-25\A_single_full_body_3D_Pixar_st_2026-08-08T13-47-50.png")
OUTPUT = Path(r"C:\Users\vince\WorkBuddy\2026-08-07-08-52-25\ip-transparent.png")
BACKUP = Path(r"C:\Users\vince\WorkBuddy\2026-08-07-08-52-25\ip-transparent.bak")

# Tunable parameters.
THRESHOLD = 58
MEDIAN_SIZE = 9
BLUR_RADIUS = 1.2
EDGE_SAMPLE = 90
MIN_COMPONENT_AREA = 1200


def sample_background_color(rgb):
    h, w, _ = rgb.shape
    corners = np.concatenate(
        [
            rgb[:EDGE_SAMPLE, :EDGE_SAMPLE].reshape(-1, 3),
            rgb[:EDGE_SAMPLE, w - EDGE_SAMPLE :].reshape(-1, 3),
            rgb[h - EDGE_SAMPLE :, :EDGE_SAMPLE].reshape(-1, 3),
            rgb[h - EDGE_SAMPLE :, w - EDGE_SAMPLE :].reshape(-1, 3),
        ],
        axis=0,
    )
    # Quantize before Counter so gentle gradients still vote together.
    quantized = (corners // 8) * 8
    return np.array(Counter(map(tuple, quantized)).most_common(1)[0][0], dtype=np.int16)


def connected_components(mask):
    h, w = mask.shape
    seen = np.zeros((h, w), dtype=bool)
    components = []

    for y in range(h):
        xs = np.where(mask[y] & ~seen[y])[0]
        for start_x in xs:
            if seen[y, start_x] or not mask[y, start_x]:
                continue

            q = deque([(y, int(start_x))])
            seen[y, start_x] = True
            pixels = []

            while q:
                cy, cx = q.popleft()
                pixels.append((cy, cx))
                for ny in (cy - 1, cy, cy + 1):
                    for nx in (cx - 1, cx, cx + 1):
                        if (
                            ny < 0
                            or ny >= h
                            or nx < 0
                            or nx >= w
                            or seen[ny, nx]
                            or not mask[ny, nx]
                        ):
                            continue
                        seen[ny, nx] = True
                        q.append((ny, nx))

            if len(pixels) >= MIN_COMPONENT_AREA:
                components.append(pixels)

    return components


def flood_background(bg_mask):
    h, w = bg_mask.shape
    visited = np.zeros((h, w), dtype=bool)
    q = deque()

    for x in range(w):
        q.append((0, x))
        q.append((h - 1, x))
    for y in range(h):
        q.append((y, 0))
        q.append((y, w - 1))

    while q:
        y, x = q.popleft()
        if y < 0 or y >= h or x < 0 or x >= w or visited[y, x] or not bg_mask[y, x]:
            continue
        visited[y, x] = True
        q.extend(((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)))

    return visited


def main():
    if OUTPUT.exists() and not BACKUP.exists():
        shutil.copy2(OUTPUT, BACKUP)

    original = Image.open(INPUT).convert("RGBA")
    denoised = original.filter(ImageFilter.MedianFilter(size=MEDIAN_SIZE))
    arr = np.array(denoised)
    rgb = arr[:, :, :3].astype(np.int32)
    h, w, _ = rgb.shape

    bg = sample_background_color(rgb).astype(np.int32)
    color_distance = np.sqrt(((rgb - bg) ** 2).sum(axis=2))

    # Build a conservative semantic mask. This avoids treating the baked purple-blue
    # atmosphere as foreground just because it sits near the character.
    r, g, b = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]
    yy, xx = np.mgrid[0:h, 0:w]
    body_zone = (xx > w * 0.10) & (xx < w * 0.82) & (yy > h * 0.02) & (yy < h * 0.98)
    ai_zone = (xx > w * 0.58) & (xx < w * 0.88) & (yy > h * 0.24) & (yy < h * 0.58)
    laptop_zone = (xx > w * 0.08) & (xx < w * 0.58) & (yy > h * 0.36) & (yy < h * 0.62)

    warm_skin_hair = body_zone & (r > g + 8) & (r > b + 10) & (r > 72)
    cream_clothes_bag = body_zone & (r > 150) & (g > 128) & (b > 105) & (r >= g) & (g >= b - 18)
    white_clothes_shoes = body_zone & (r + g + b > 560) & (np.maximum.reduce([r, g, b]) - np.minimum.reduce([r, g, b]) < 100)
    denim = body_zone & (b > r + 18) & (g > r - 4) & (b > 92) & (yy > h * 0.52)
    cyan_ui_or_ai = (ai_zone | laptop_zone) & (g > 118) & (b > 118) & (g > r + 4)
    laptop_dark = laptop_zone & (r + g + b < 230) & (b > r + 8)
    dark_object_edges = body_zone & (r + g + b < 150) & (color_distance > 34)
    foreground = warm_skin_hair | cream_clothes_bag | white_clothes_shoes | denim | cyan_ui_or_ai | laptop_dark | dark_object_edges

    # Drop border-connected haze/noise first.
    foreground[:5, :] = False
    foreground[-5:, :] = False
    foreground[:, :5] = False
    foreground[:, -5:] = False

    components = connected_components(foreground)
    components.sort(key=len, reverse=True)

    clean = np.zeros((h, w), dtype=np.uint8)
    kept_area = 0
    for component in components[:6]:
        ys, xs = zip(*component)
        min_x, max_x = min(xs), max(xs)
        min_y, max_y = min(ys), max(ys)
        area = len(component)
        # Keep the full character, laptop glow, and the floating AI companion.
        if area == len(components[0]) or (max_x > w * 0.52 and min_y < h * 0.58 and max_y > h * 0.28):
            clean[list(ys), list(xs)] = 255
            kept_area += area

    clean_img = Image.fromarray(clean, "L")
    clean_img = clean_img.filter(ImageFilter.MaxFilter(17))
    clean_img = clean_img.filter(ImageFilter.MedianFilter(size=5))
    clean_img = clean_img.filter(ImageFilter.GaussianBlur(radius=BLUR_RADIUS))

    out = np.array(original)
    alpha = np.array(clean_img)
    # Explicitly remove original watermark corner.
    alpha[int(h * 0.91) :, int(w * 0.80) :] = 0
    out[:, :, 3] = alpha

    Image.fromarray(out, "RGBA").save(OUTPUT)

    removed = int((alpha == 0).sum())
    non_zero_ratio = float((alpha > 0).sum() / alpha.size)
    coverage = float((alpha > 0).sum() / (h * w))

    print(f"background pixels removed: {removed}")
    print(f"final alpha non-zero ratio: {non_zero_ratio:.4f}")
    print(f"mask coverage ratio: {coverage:.4f}")
    print(f"background key color RGB: {tuple(int(x) for x in bg)}")
    print(f"output: {OUTPUT}")


if __name__ == "__main__":
    main()
