#!/usr/bin/env python3
"""
Simple Python script to resize icons for PWA
Requires: pip install Pillow
"""

from PIL import Image
import os

# Paths
source = r"G:\Desktop\Projet Web\Jason83\artisan-post-generator\frontend\public\icon.png"
output_dir = r"G:\Desktop\Projet Web\Jason83\artisan-post-generator\frontend\public"

print("\n🎨 Resizing icons for PWA...\n")

try:
    # Load source image
    img = Image.open(source)
    
    # Create 192x192
    img_192 = img.resize((192, 192), Image.Resampling.LANCZOS)
    img_192.save(os.path.join(output_dir, "icon-192x192.png"))
    print("✓ Created: icon-192x192.png")
    
    # Create 512x512
    img_512 = img.resize((512, 512), Image.Resampling.LANCZOS)
    img_512.save(os.path.join(output_dir, "icon-512x512.png"))
    print("✓ Created: icon-512x512.png")
    
    # Create favicon
    img_32 = img.resize((32, 32), Image.Resampling.LANCZOS)
    img_32.save(os.path.join(output_dir, "favicon.ico"))
    print("✓ Created: favicon.ico")
    
    print("\n✅ All icons created successfully!\n")
    
except Exception as e:
    print(f"\n❌ Error: {e}\n")
    print("Please install Pillow: pip install Pillow")
