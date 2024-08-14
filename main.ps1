if ((Get-Command "ws" -ErrorAction SilentlyContinue) -eq $null) {
    Write-Host
    Write-Host "This program requires local-web-server to be installed and available in the PATH."
    Write-Host
}

ws --spa index.html -p 9000
