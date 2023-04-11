param(
    [switch]$help,
    [switch]$generate,
    [switch]$minify
)

if ($help.IsPresent) {
    Write-Host
    Write-Host "Info:"
    Write-Host "    Builds the TypeScript files, and optionally generates cache and or minifies the JavaScript."
    Write-Host
    Write-Host "Parameters:"
    Write-Host "    -help: Brings up this help message."
    Write-Host "    -generate: Calls the ./js/tool/generate.js tool."
    Write-Host "    -minify: Calls the ./js/tool/minify.js tool."
    Write-Host
}
else {
    if ((Get-Command "node" -ErrorAction SilentlyContinue) -eq $null) {
        Write-Host
        Write-Host "This program requires Node.js to be installed and available in the PATH."
        Write-Host
    }
    elseif ((Get-Command "tsc" -ErrorAction SilentlyContinue) -eq $null) {
        Write-Host
        Write-Host "This program requires tsc, the TypeScript compiler, to be installed and available in the PATH."
        Write-Host
    }
    elseif ((Get-Command "terser" -ErrorAction SilentlyContinue) -eq $null) {
        Write-Host
        Write-Host "This program requires terser to be installed and available in the PATH."
        Write-Host
    }
    else {
        tsc --build
        if ($generate.IsPresent) {
            node ./js/tool/generate.js
        }
        if ($minify.IsPresent) {
            node ./js/tool/minify.js
        }
    }
}
