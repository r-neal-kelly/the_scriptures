param(
    [switch]$help,
    [switch]$debug,
    [switch]$release,
    [switch]$generate,
    [switch]$clean
)

function Display_Help {
    Write-Host
    Write-Host "    Compiles and generates the Scriptures."
    Write-Host
    Write-Host "Parameters:"
    Write-Host "    -help: Brings up this help message."
    Write-Host "    -debug: Compiles JavaScript files in debug mode. Optionally cleans old files."
    Write-Host "    -release: Compiles JavaScript files in release mode. Always cleans old files."
    Write-Host "    -generate: Compiles Data files. Optionally cleans old files."
    Write-Host "    -clean: Removes all compiled JavaScript files with debug and release,"
    Write-Host "            and all data files with generate before recompiling them."
    Write-Host
}

if ($help.IsPresent) {
    Display_Help
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
    elseif ($debug.IsPresent -and $release.IsPresent) {
        Write-Host
        Write-Host "This program requires either the debug flag or the release flag, but cannot proceed with both."
        Write-Host
    }
    elseif ($debug.IsPresent -or $release.IsPresent -or $generate.IsPresent) {
        if ($debug.IsPresent -or $release.IsPresent) {
            if ($clean.IsPresent -or $release.IsPresent) {
                Write-Host "    Removing old JavaScript..."
                if (Test-Path ./js -PathType Container) {
                    Remove-Item -Recurse -Force ./js
                }
            }

            Write-Host "    Compiling TypeScript into JavaScript..."
            tsc --build

            if ($release.IsPresent) {
                Write-Host "    Minifying all JavaScript files..."
                node ./js/tool/minify.js

                Write-Host "    Removing Asserts from JavaScript files..."
                node ./js/tool/remove_asserts.js
            }
        }

        if ($generate.IsPresent) {
            if ($clean.IsPresent) {
                node ./js/tool/generate.js --force
            }
            else {
                node ./js/tool/generate.js
            }
        }

        if ($debug.IsPresent -or $release.IsPresent) {
            Write-Host "    Updating Data Consts..."
            node ./js/tool/update_data_consts.js
        }
        
        Write-Host "    Done building."
    }
    else {
        Display_Help
    }
}
