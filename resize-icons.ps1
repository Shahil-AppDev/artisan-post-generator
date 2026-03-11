# PowerShell script to resize icons using .NET
# No external tools required!

Add-Type -AssemblyName System.Drawing

$sourcePath = "G:\Desktop\Projet Web\Jason83\artisan-post-generator\frontend\public\icon.png"
$outputDir = "G:\Desktop\Projet Web\Jason83\artisan-post-generator\frontend\public"

# Load the source image
$sourceImage = [System.Drawing.Image]::FromFile($sourcePath)

# Function to resize and save
function Resize-Image {
    param(
        [System.Drawing.Image]$Image,
        [int]$Width,
        [int]$Height,
        [string]$OutputPath
    )
    
    $newImage = New-Object System.Drawing.Bitmap($Width, $Height)
    $graphics = [System.Drawing.Graphics]::FromImage($newImage)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.DrawImage($Image, 0, 0, $Width, $Height)
    $graphics.Dispose()
    
    $newImage.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $newImage.Dispose()
    
    Write-Host "✓ Created: $OutputPath" -ForegroundColor Green
}

Write-Host "`n🎨 Resizing icons for PWA...`n" -ForegroundColor Cyan

# Create 192x192
Resize-Image -Image $sourceImage -Width 192 -Height 192 -OutputPath "$outputDir\icon-192x192.png"

# Create 512x512
Resize-Image -Image $sourceImage -Width 512 -Height 512 -OutputPath "$outputDir\icon-512x512.png"

# Create favicon (32x32)
Resize-Image -Image $sourceImage -Width 32 -Height 32 -OutputPath "$outputDir\favicon-32x32.png"

$sourceImage.Dispose()

Write-Host "`n✅ All icons created successfully!`n" -ForegroundColor Green
Write-Host "Files created in: $outputDir" -ForegroundColor Yellow
Write-Host "  - icon-192x192.png" -ForegroundColor White
Write-Host "  - icon-512x512.png" -ForegroundColor White
Write-Host "  - favicon-32x32.png" -ForegroundColor White
