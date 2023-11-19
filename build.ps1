param(
    [switch]$help,
    [switch]$release,
    [switch]$minify,
    [switch]$generate,
    [switch]$force_generate
)

if ($help.IsPresent) {
    Write-Host
    Write-Host "Info:"
    Write-Host "    Builds the TypeScript files, and optionally generates cache and or minifies the JavaScript."
    Write-Host
    Write-Host "Parameters:"
    Write-Host "    -help: Brings up this help message."
    Write-Host "    -release: Minifies all JavaScript files and removes asserts."
    Write-Host "    -minify: Minifies all JavaScript files."
    Write-Host "    -generate: Generates all out of date Info and compressed files in data."
    Write-Host "    -force_generate: Forcefully generates all Info and compressed files in data."
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
        if ($release.IsPresent -or $minify.IsPresent) {
            Write-Host "    Removing old JavaScript..."
            if (Test-Path ./js -PathType Container) {
                Remove-Item -Recurse -Force ./js
            }
        }
        
        Write-Host "    Compiling TypeScript into JavaScript..."
        tsc --build

        if ($release.IsPresent -or $minify.IsPresent) {
            Write-Host "    Minifying all JavaScript files..."
            node ./js/tool/minify.js
        }
        if ($release.IsPresent) {
            Write-Host "    Removing Asserts from JavaScript files..."
            node ./js/tool/remove_asserts.js
        }

        if ($force_generate.IsPresent) {
            node ./js/tool/generate.js --force
        }
        elseif ($generate.IsPresent) {
            node ./js/tool/generate.js
        }

        Write-Host "    Done building."
    }
}
