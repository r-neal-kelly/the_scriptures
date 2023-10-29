param(
    [switch]$help,
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
    Write-Host "    -minify: Calls the ./js/tool/minify.js tool."
    Write-Host "    -generate: Calls the ./js/tool/generate.js tool."
    Write-Host "    -force_generate: Calls the ./js/tool/generate.js tool with the -f (--force) option."
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
        if ($minify.IsPresent) {
            Write-Host "    Removing old JavaScript..."
            Remove-Item -Recurse -Force ./js
        }
        
        Write-Host "    Compiling TypeScript into JavaScript..."
        tsc --build

        if ($minify.IsPresent) {
            Write-Host "    Minifying all JavaScript files..."
            node ./js/tool/minify.js
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
