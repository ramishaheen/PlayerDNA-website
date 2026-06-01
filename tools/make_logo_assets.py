"""Generate transparent PlayerDNA logo assets from the source PNG.

Source is the full lockup (athlete+helix mark, wordmark, tagline) on solid black.
We luminance-key the black background to transparency so the glowing logo blends
naturally on the site's dark surfaces, then crop:
  - logo-full.png       full lockup (loader splash)
  - logo-mark.png       upper graphic only: athlete + helix + heartbeat + speed lines
  - logo-mark-core.png  tight athlete + helix (compact nav/footer mark)
  - logo-icon.png       square-padded core (favicon / demo badge)
"""
import os
from PIL import Image, ImageChops

SRC = r"C:\Users\DRRAM\OneDrive\Desktop\AI related\AI sports\3b26b7fc-50ee-43dd-9ece-0a3feb18a5a4.png"
OUT = r"C:\Users\DRRAM\Ai sport website\assets\img"

src = Image.open(SRC).convert("RGB")
W, H = src.size

# --- luminance-based soft key: alpha tracks brightness, pure black -> transparent ---
r, g, b = src.split()
lum = ImageChops.lighter(ImageChops.lighter(r, g), b)          # max(R,G,B) per pixel
# Crush the dark glow-to-black halo fully to transparent (clean cutout on ANY background),
# then ramp quickly so the bright helix / wordmark / speed lines stay opaque.
FLOOR = 22
alpha = lum.point(lambda v: 0 if v < FLOOR else min(255, int((v - FLOOR) * 2.1)))
rgba = src.convert("RGBA")
rgba.putalpha(alpha)


def trim(im, thr=26, pad=10):
    """Crop to the bounding box of meaningfully-opaque pixels (+padding)."""
    mask = im.getchannel("A").point(lambda v: 255 if v > thr else 0)
    bbox = mask.getbbox()
    if not bbox:
        return im
    l, t, rr, bb = bbox
    l = max(0, l - pad); t = max(0, t - pad)
    rr = min(im.width, rr + pad); bb = min(im.height, bb + pad)
    return im.crop((l, t, rr, bb))


def square(im, pad_frac=0.06):
    side = int(max(im.size) * (1 + pad_frac * 2))
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.paste(im, ((side - im.width) // 2, (side - im.height) // 2), im)
    return canvas


def fit_w(im, w):
    return im if im.width <= w else im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)


def fit_h(im, h):
    return im if im.height <= h else im.resize((round(im.width * h / im.height), h), Image.LANCZOS)


# full lockup (displayed <=330px wide -> 760px covers retina/zoom)
full = fit_w(trim(rgba), 760)
full.save(os.path.join(OUT, "logo-full.png"), optimize=True)

# upper graphic only (exclude wordmark/tagline band ~ lower 38%)
mark = fit_h(trim(rgba.crop((0, int(0.085 * H), W, int(0.625 * H)))), 240)
mark.save(os.path.join(OUT, "logo-mark.png"), optimize=True)

# tight athlete + helix (displayed ~38px tall -> 240px covers retina/zoom)
core = fit_h(trim(rgba.crop((int(0.29 * W), int(0.085 * H), int(0.73 * W), int(0.615 * H)))), 240)
core.save(os.path.join(OUT, "logo-mark-core.png"), optimize=True)

# square icon for favicon / badge
icon = square(core).resize((160, 160), Image.LANCZOS)
icon.save(os.path.join(OUT, "logo-icon.png"), optimize=True)

print("full", full.size, "| mark", mark.size, "| core", core.size, "| icon", icon.size)
