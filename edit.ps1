if ((Get-Command "ws" -ErrorAction SilentlyContinue) -eq $null) {
    Write-Host
    Write-Host "This program requires local-web-server to be installed and available in the PATH."
    Write-Host
}

ws --spa editor.html -p 8000
