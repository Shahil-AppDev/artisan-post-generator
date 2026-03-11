# PWA Icons Setup Guide

The application includes an SVG icon template. You need to convert it to PNG format for the PWA to work properly.

## Quick Setup

### Option 1: Online Converter (Easiest)

1. Go to https://cloudconvert.com/svg-to-png
2. Upload `frontend/public/icon.svg`
3. Convert to PNG with these sizes:
   - **192x192** → Save as `icon-192x192.png`
   - **512x512** → Save as `icon-512x512.png`
4. Place both files in `frontend/public/`

### Option 2: Using ImageMagick (Command Line)

```bash
cd frontend/public

# Install ImageMagick (if not installed)
# Ubuntu/Debian: sudo apt install imagemagick
# macOS: brew install imagemagick
# Windows: Download from https://imagemagick.org/

# Convert SVG to PNG
magick icon.svg -resize 192x192 icon-192x192.png
magick icon.svg -resize 512x512 icon-512x512.png
magick icon.svg -resize 32x32 favicon.ico
```

### Option 3: Using Inkscape

1. Install Inkscape: https://inkscape.org/
2. Open `icon.svg` in Inkscape
3. Export as PNG:
   - File → Export PNG Image
   - Set width/height to 192 or 512
   - Export
4. Repeat for both sizes

### Option 4: Online Tool - Favicon Generator

1. Go to https://realfavicongenerator.net/
2. Upload `icon.svg`
3. Generate all icon sizes
4. Download and extract to `frontend/public/`

## Required Files

After conversion, you should have:

```
frontend/public/
├── icon.svg (template - already created)
├── icon-192x192.png (you need to create)
├── icon-512x512.png (you need to create)
└── favicon.ico (optional but recommended)
```

## Verify PWA Icons

After adding the icons:

1. Start the app: `docker-compose up -d`
2. Open http://localhost:3000 in Chrome/Edge
3. Check browser DevTools → Application → Manifest
4. Verify icons are loaded correctly

## Custom Icon Design

Want a custom icon? You can:

1. **Edit the SVG**: Open `icon.svg` in any text/vector editor
2. **Use a design tool**: Create in Figma, Canva, or Adobe Illustrator
3. **Hire a designer**: Get a professional logo on Fiverr/99designs
4. **Use AI**: Generate with DALL-E, Midjourney, or similar

### Design Tips

- **Simple shapes**: Icons should be recognizable at small sizes
- **High contrast**: Use contrasting colors for visibility
- **Square format**: 512x512px works best
- **Safe area**: Keep important elements away from edges
- **Brand colors**: Use your company colors

## Testing PWA Installation

Once icons are in place:

### On Mobile (Android)
1. Open app in Chrome
2. Tap menu → "Add to Home Screen"
3. Icon should appear on home screen

### On Desktop (Chrome/Edge)
1. Open app
2. Look for install icon in address bar
3. Click to install as desktop app

## Troubleshooting

### Icons not showing?
- Clear browser cache
- Check file names match exactly
- Verify files are in `frontend/public/`
- Restart Docker containers

### Wrong icon displayed?
- Browser cache issue - hard refresh (Ctrl+Shift+R)
- Check manifest.json references correct paths
- Verify PNG files are valid (open in image viewer)

## Production Checklist

Before deploying:
- [ ] icon-192x192.png created
- [ ] icon-512x512.png created
- [ ] favicon.ico created (optional)
- [ ] Icons tested in browser
- [ ] PWA install tested on mobile
- [ ] Icons look good on both light/dark backgrounds
