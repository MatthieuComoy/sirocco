import os
from PIL import Image, ImageDraw

def draw_anchor_icon(size, transparent=False):
    # Create an image with a dark marine blue background or transparent
    bg_color = (0, 0, 0, 0) if transparent else (15, 23, 42, 255) # Slate-900 or transparent
    img = Image.new("RGBA", (size, size), bg_color)
    draw = ImageDraw.Draw(img)
    
    # Center and scale base
    c = size // 2
    r = size // 4
    
    # Draw waves (arc)
    wave_width = max(1, size // 30)
    draw.arc([c - 2*r, c + int(r * 0.8), c + 2*r, c + int(r * 1.8)], 180, 360, fill=(34, 211, 238, 255), width=wave_width) # Cyan-400
    
    # Draw sailboat hull
    hull_points = [
        (c - int(1.4*r), c + int(r * 0.8)),
        (c + int(1.4*r), c + int(r * 0.8)),
        (c + int(0.9*r), c + int(1.3*r)),
        (c - int(0.9*r), c + int(1.3*r))
    ]
    draw.polygon(hull_points, fill=(14, 116, 144, 255)) # Cyan-700
    
    # Draw mast
    mast_width = max(1, size // 40)
    draw.line([(c, c - int(1.5*r)), (c, c + int(0.8*r))], fill=(255, 255, 255, 255), width=mast_width)
    
    # Draw sails
    sail_offset = max(1, size // 60)
    sail1 = [
        (c - sail_offset, c - int(1.4*r)),
        (c - sail_offset, c + int(0.6*r)),
        (c - int(1.1*r), c + int(0.6*r))
    ]
    draw.polygon(sail1, fill=(255, 255, 255, 255))
    
    sail2 = [
        (c + sail_offset, c - int(1.2*r)),
        (c + sail_offset, c + int(0.6*r)),
        (c + int(0.9*r), c + int(0.6*r))
    ]
    draw.polygon(sail2, fill=(34, 211, 238, 255)) # Cyan-400
    
    return img

# Determine resample filter
try:
    resample_filter = Image.Resampling.LANCZOS
except AttributeError:
    resample_filter = Image.ANTIALIAS

output_dir = "/var/home/matthieu/Documents/Sirroco/icons"
os.makedirs(output_dir, exist_ok=True)

# Generate high-res masters
master_solid = draw_anchor_icon(512, transparent=False)
master_transparent = draw_anchor_icon(512, transparent=True)

# 1. PWA Icons (Solid background)
master_solid.save(os.path.join(output_dir, "icon-512.png"))
master_solid.resize((192, 192), resample_filter).save(os.path.join(output_dir, "icon-192.png"))

# 2. Apple Touch Icon (Solid background required, 180x180)
master_solid.resize((180, 180), resample_filter).save(os.path.join(output_dir, "apple-touch-icon.png"))

# 3. Favicon PNGs (Transparent background looks great on browser tabs)
master_transparent.resize((16, 16), resample_filter).save(os.path.join(output_dir, "favicon-16x16.png"))
master_transparent.resize((32, 32), resample_filter).save(os.path.join(output_dir, "favicon-32x32.png"))

# 4. favicon.ico (Multi-resolution: 16x16, 32x32, 48x48)
master_transparent.save(
    os.path.join(output_dir, "favicon.ico"),
    sizes=[(16, 16), (32, 32), (48, 48)]
)

# 5. MSTile Icon (Transparent background, 150x150)
master_transparent.resize((150, 150), resample_filter).save(os.path.join(output_dir, "mstile-150x150.png"))

print("All icons (PWA, Apple, Favicons, MSTile) generated successfully!")

