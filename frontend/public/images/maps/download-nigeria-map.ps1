# PowerShell script to download Nigeria map image

Write-Host "Downloading Nigeria map..." -ForegroundColor Green

# Nigeria map from Wikimedia Commons (showing all states)
$url = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Nigeria_location_map.svg/1024px-Nigeria_location_map.svg.png"
$output = "nigeria-map.png"

try {
    Invoke-WebRequest -Uri $url -OutFile $output -UseBasicParsing
    Write-Host "Successfully downloaded: $output" -ForegroundColor Green
    Write-Host "`nMap download complete!" -ForegroundColor Cyan
    Write-Host "The Nigeria map is now available at: images/maps/nigeria-map.png" -ForegroundColor Yellow
} catch {
    Write-Host "Failed to download: $output" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
