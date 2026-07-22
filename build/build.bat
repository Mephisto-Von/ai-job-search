@echo off
REM AI Job Search - Windows Build Script
REM Compiles CLI tools to .exe and creates installers

setlocal enabledelayedexpansion

set VERSION=2.0.0
set BUILD_DIR=build\dist
set OUTPUT_DIR=build\output
set TOOLS=indeed-search glassdoor-search stepstone-search pakistan-search india-search

echo === AI Job Search CLI Builder v%VERSION% ===
echo.

REM Clean
echo Cleaning build directories...
if exist "%BUILD_DIR%" rmdir /s /q "%BUILD_DIR%"
if exist "%OUTPUT_DIR%" rmdir /s /q "%OUTPUT_DIR%"
mkdir "%BUILD_DIR%"
mkdir "%OUTPUT_DIR%"

REM Build tools
echo.
echo Building executables...
for %%t in (%TOOLS%) do (
    echo Building %%t for Windows...
    bun build --compile --target=windows-x64 ".agents\skills\%%t\cli\src\cli.ts" --outfile "%BUILD_DIR%\%%t-windows.exe"
    if !errorlevel! equ 0 (
        echo   ✓ %%t-windows.exe
    ) else (
        echo   ✗ Failed to build %%t
    )
)

REM Create batch wrappers
echo.
echo Creating batch wrappers...
for %%t in (%TOOLS%) do (
    echo @echo off > "%BUILD_DIR%\%%t.cmd"
    echo REM AI Job Search - %%t launcher >> "%BUILD_DIR%\%%t.cmd"
    echo set SCRIPT_DIR=%%~dp0 >> "%BUILD_DIR%\%%t.cmd"
    echo "%%SCRIPT_DIR%%%t-windows.exe" %%* >> "%BUILD_DIR%\%%t.cmd"
    echo   ✓ %%t.cmd
)

REM Create NSIS installer scripts
echo.
echo Creating NSIS installer scripts...
for %%t in (%TOOLS%) do (
    (
        echo !include "MUI2.nsh"
        echo.
        echo Name "%%t"
        echo OutFile "%OUTPUT_DIR%\%%t-setup-%VERSION%.exe"
        echo InstallDir "$PROGRAMFILES\%%t"
        echo.
        echo !insertmacro MUI_PAGE_DIRECTORY
        echo !insertmacro MUI_PAGE_INSTFILES
        echo !insertmacro MUI_UNPAGE_CONFIRM
        echo !insertmacro MUI_UNPAGE_INSTFILES
        echo.
        echo !insertmacro MUI_LANGUAGE "English"
        echo.
        echo Section "Install"
        echo   SetOutPath $INSTDIR
        echo   File "%BUILD_DIR%\%%t-windows.exe"
        echo   CreateDirectory "$SMPROGRAMS\%%t"
        echo   CreateShortCut "$SMPROGRAMS\%%t\%%t.lnk" "$INSTDIR\%%t-windows.exe"
        echo   CreateShortCut "$DESKTOP\%%t.lnk" "$INSTDIR\%%t-windows.exe"
        echo   WriteUninstaller "$INSTDIR\uninstall.exe"
        echo SectionEnd
        echo.
        echo Section "Uninstall"
        echo   Delete "$INSTDIR\%%t-windows.exe"
        echo   Delete "$INSTDIR\uninstall.exe"
        echo   RMDir /r "$SMPROGRAMS\%%t"
        echo   Delete "$DESKTOP\%%t.lnk"
        echo   RMDir $INSTDIR
        echo SectionEnd
    ) > "%BUILD_DIR%\%%t-installer.nsi"
    echo   ✓ %%t-installer.nsi
)

REM Create Inno Setup scripts
echo.
echo Creating Inno Setup scripts...
for %%t in (%TOOLS%) do (
    (
        echo ; AI Job Search - %%t Installer
        echo #define MyAppName "%%t"
        echo #define MyAppVersion "%VERSION%"
        echo #define MyAppPublisher "AI Job Search"
        echo #define MyAppURL "https://github.com/MadsLorentzen/ai-job-search"
        echo.
        echo [Setup]
        echo AppId={{%%RANDOM%%%%RANDOM%%%%RANDOM%%%}
        echo AppName={#MyAppName}
        echo AppVersion={#MyAppVersion}
        echo AppPublisher={#MyAppPublisher}
        echo AppPublisherURL={#MyAppURL}
        echo DefaultDirName={autopf}\{#MyAppName}
        echo DefaultGroupName={#MyAppName}
        echo OutputDir=%OUTPUT_DIR%
        echo OutputBaseFilename=%%t-setup-%VERSION%
        echo Compression=lzma2/ultra64
        echo SolidCompression=yes
        echo WizardStyle=modern
        echo.
        echo [Files]
        echo Source: "%BUILD_DIR%\%%t-windows.exe"; DestDir: "{app}"; Flags: ignoreversion
        echo.
        echo [Icons]
        echo Name: "{group}\{#MyAppName}"; Filename: "{app}\%%t-windows.exe"
        echo Name: "{group}\Uninstall {#MyAppName}"; Filename: "{uninstallexe}"
    ) > "%BUILD_DIR%\%%t-installer.iss"
    echo   ✓ %%t-installer.iss
)

REM Create MSI wrapper
echo.
echo Creating MSI wrapper...
(
    echo #!/usr/bin/env python3
    echo """MSI Wrapper for AI Job Search"""
    echo import subprocess
    echo import sys
    echo.
    echo def create_msi(tool_name^):
    echo     # Create WiX source
    echo     wix_content = f"""
    echo ^<Wix xmlns="http://schemas.microsoft.com/wix/2006/wi"^>
    echo   ^<Product Id="*" Name="{tool_name}" Language="1033" Version="%VERSION%" Manufacturer="AI Job Search"^>
    echo     ^<Package InstallerVersion="200" Compressed="yes" InstallScope="perMachine" /^>
    echo     ^<Directory Id="TARGETDIR" Name="SourceDir"^>
    echo       ^<Directory Id="ProgramFilesFolder"^>
    echo         ^<Directory Id="INSTALLFOLDER" Name="{tool_name}" /^>
    echo       ^/Directory^>
    echo     ^/Directory^>
    echo     ^<ComponentGroup Id="ProductComponents" Directory="INSTALLFOLDER"^>
    echo       ^<Component Id="MainExecutable"^>
    echo         ^<File Id="exeFile" Source="{tool_name}-windows.exe" KeyPath="yes" /^>
    echo       ^/Component^>
    echo     ^/ComponentGroup^>
    echo     ^<Feature Id="ProductFeature" Title="{tool_name}" Level="1"^>
    echo       ^<ComponentGroupRef Id="ProductComponents" /^>
    echo     ^/Feature^>
    echo   ^/Product^>
    echo ^/Wix^>
    echo """
    echo.
    echo     with open(f"{tool_name}.wxs", "w" ^) as f:
    echo         f.write(wix_content^)
    echo.
    echo     subprocess.run(["candle", f"{tool_name}.wxs"], check=True^)
    echo     subprocess.run(["light", f"{tool_name}.wixobj"], check=True^)
    echo     print(f"MSI created: {tool_name}-%VERSION%.msi"^)
    echo.
    echo if __name__ == "__main__":
    echo     for tool in ["indeed-search", "glassdoor-search", "stepstone-search", "pakistan-search", "india-search"]:
    echo         create_msi(tool^)
) > "%BUILD_DIR%\create-msi.py"
echo   ✓ create-msi.py

REM Create portable package
echo.
echo Creating portable package...
cd "%BUILD_DIR%"
powershell -command "Compress-Archive -Path '*.exe','*.cmd','*.nsi','*.iss' -DestinationPath '%OUTPUT_DIR%\ai-job-search-portable-%VERSION%.zip' -Force"
cd ..\..
echo   ✓ ai-job-search-portable-%VERSION%.zip

REM Summary
echo.
echo === Build Complete ===
echo Output directory: %OUTPUT_DIR%
echo.
echo Files generated:
dir /b "%OUTPUT_DIR%"

echo.
echo To create installers:
echo   1. Install NSIS: https://nsis.sourceforge.io/
echo   2. Run: makensis build\dist\*-installer.nsi
echo   3. Or install Inno Setup and open .iss files
echo   4. For MSI: python build\dist\create-msi.py (requires WiX Toolset)

pause
