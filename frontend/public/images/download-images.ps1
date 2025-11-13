# PowerShell Script to Download All Project Images
# Run this script from the frontend/public/images directory

Write-Host "Starting image download process..." -ForegroundColor Green
Write-Host "This will download 15 images from Unsplash" -ForegroundColor Yellow
Write-Host ""

# Function to download image with progress
function Get-ProjectImage {
    param(
        [string]$Url,
        [string]$OutputPath,
        [string]$Description
    )
    
    Write-Host "Downloading: $Description" -ForegroundColor Cyan
    Write-Host "  URL: $Url"
    Write-Host "  Saving to: $OutputPath"
    
    try {
        Invoke-WebRequest -Uri $Url -OutFile $OutputPath -UseBasicParsing
        Write-Host "  Success!" -ForegroundColor Green
    }
    catch {
        Write-Host "  Failed: $_" -ForegroundColor Red
    }
    Write-Host ""
}

# Create directories if they don't exist
$dirs = @("hero", "waste-types", "steps", "team")
foreach ($dir in $dirs) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir | Out-Null
        Write-Host "Created directory: $dir" -ForegroundColor Yellow
    }
}

# Hero/Carousel Images
Get-ProjectImage -Url "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1200" `
    -OutputPath "hero\clean-environment.jpg" `
    -Description "Clean Environment (Hero 1)"

Get-ProjectImage -Url "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200" `
    -OutputPath "hero\smart-waste.jpg" `
    -Description "Smart Waste Management (Hero 2)"

Get-ProjectImage -Url "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=1200" `
    -OutputPath "hero\recycling-easy.jpg" `
    -Description "Recycling Made Easy (Hero 3)"

# Waste Type Images
Get-ProjectImage -Url "https://images.unsplash.com/photo-1580169980114-ccd0babfa840?w=500" `
    -OutputPath "waste-types\paper.jpg" `
    -Description "Paper"

Get-ProjectImage -Url "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=500" `
    -OutputPath "waste-types\plastics.jpg" `
    -Description "Plastics"

Get-ProjectImage -Url "https://images.unsplash.com/photo-1625740788093-f602eff0d56e?w=500" `
    -OutputPath "waste-types\metal.jpg" `
    -Description "Metal"

# How It Works Step Images
Get-ProjectImage -Url "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600" `
    -OutputPath "steps\step1-signup.jpg" `
    -Description "Step 1: Sign Up"

Get-ProjectImage -Url "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600" `
    -OutputPath "steps\step2-request.jpg" `
    -Description "Step 2: Request"

Get-ProjectImage -Url "https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=600" `
    -OutputPath "steps\step3-schedule.jpg" `
    -Description "Step 3: Schedule"

Get-ProjectImage -Url "https://images.unsplash.com/photo-1580169980114-ccd0babfa840?w=600" `
    -OutputPath "steps\step4-collect.jpg" `
    -Description "Step 4: Collect"

Get-ProjectImage -Url "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600" `
    -OutputPath "steps\step5-recycle.jpg" `
    -Description "Step 5: Recycle"

# Team Images
Get-ProjectImage -Url "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400" `
    -OutputPath "team\environmental.jpg" `
    -Description "Team: Environmental Leadership"

Get-ProjectImage -Url "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400" `
    -OutputPath "team\technology.jpg" `
    -Description "Team: Technology Innovation"

Get-ProjectImage -Url "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400" `
    -OutputPath "team\community.jpg" `
    -Description "Team: Community Engagement"

# Contact Us Images
Get-ProjectImage -Url "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1200" `
    -OutputPath "hero\contact-hero.jpg" `
    -Description "Contact Us Hero"

Get-ProjectImage -Url "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200" `
    -OutputPath "hero\contact-cta.jpg" `
    -Description "Contact Us CTA"

# Admin Home Images
Get-ProjectImage -Url "https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=1200" `
    -OutputPath "hero\admin-stats.jpg" `
    -Description "Admin Stats Background"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Download process complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Verify all images downloaded successfully"
Write-Host "2. The code has been updated to use local images"
Write-Host "3. Run 'npm run dev' to test the application"
