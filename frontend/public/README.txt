PWA ICONS NEEDED
=================

This folder contains icon.svg (a template icon).

To complete the PWA setup, you need to convert this SVG to PNG format:

REQUIRED FILES:
- icon-192x192.png (192x192 pixels)
- icon-512x512.png (512x512 pixels)
- favicon.ico (32x32 pixels, optional)

QUICK CONVERSION:
1. Visit: https://cloudconvert.com/svg-to-png
2. Upload icon.svg
3. Convert to 192x192 and 512x512
4. Save both PNG files here

OR use ImageMagick:
  magick icon.svg -resize 192x192 icon-192x192.png
  magick icon.svg -resize 512x512 icon-512x512.png

See ../docs/ICONS_SETUP.md for detailed instructions.

The app will work without these icons, but the PWA install feature 
will use default browser icons instead of your custom branding.
