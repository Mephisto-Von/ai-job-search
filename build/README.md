# Build Instructions

This directory contains scripts to build standalone executables and installers for AI Job Search CLI tools.

## Prerequisites

### Required
- [Bun](https://bun.sh) - JavaScript runtime and toolkit
- [Node.js](https://nodejs.org/) - Required by some build tools

### For Windows Installers
- [NSIS](https://nsis.sourceforge.io/) - Nullsoft Scriptable Install System
- [Inno Setup](https://jrsoftware.org/isinfo.php) - Free installer for Windows programs
- [WiX Toolset](https://wixtoolset.org/) - For creating MSI packages

## Build Commands

### Using Build Scripts

**Linux/macOS:**
```bash
# Make build script executable
chmod +x build/build.sh

# Build all tools for all platforms
./build/build.sh

# Build for specific platform
./build/build.sh --platform=windows
./build/build.sh --platform=linux
./build/build.sh --platform=macos
```

**Windows:**
```cmd
# Run the build script
build\build.bat
```

**Using Bun directly:**
```bash
# Build for Windows
bun build --compile --target=windows-x64 .agents/skills/indeed-search/cli/src/cli.ts --outfile dist/indeed-search-windows.exe

# Build for Linux
bun build --compile --target=linux-x64 .agents/skills/indeed-search/cli/src/cli.ts --outfile dist/indeed-search-linux

# Build for macOS
bun build --compile --target=darwin-x64 .agents/skills/indeed-search/cli/src/cli.ts --outfile dist/indeed-search-macos
```

## Output Files

After building, you'll find:

### Executables (dist/)
- `indeed-search-windows.exe` - Windows executable
- `indeed-search-linux` - Linux executable
- `indeed-search-macos` - macOS executable
- Same for: `glassdoor-search`, `stepstone-search`, `pakistan-search`, `india-search`

### Batch Wrappers (dist/)
- `*.cmd` - Windows batch files that launch the executables

### Installer Scripts (dist/)
- `*-installer.nsi` - NSIS installer scripts
- `*-installer.iss` - Inno Setup scripts
- `create-msi.py` - Python script for creating MSI packages

### Portable Package (output/)
- `ai-job-search-portable-*.zip` - Portable package with all executables

## Creating Installers

### NSIS Installer

1. Install [NSIS](https://nsis.sourceforge.io/)
2. Run: `makensis build\dist\*-installer.nsi`
3. Output: `build\output\*-setup-*.exe`

### Inno Setup

1. Install [Inno Setup](https://jrsoftware.org/isinfo.php/)
2. Open `build\dist\*-installer.iss`
3. Click "Compile" to create installer

### MSI Package

1. Install [WiX Toolset](https://wixtoolset.org/)
2. Run: `python build\dist\create-msi.py`
3. Output: `*.msi` files

## Supported Platforms

| Platform | Target | Output |
|----------|--------|--------|
| Windows | windows-x64 | *.exe |
| Linux | linux-x64 | * (no extension) |
| macOS | darwin-x64 | * (no extension) |

## File Sizes

Standalone executables are typically 30-50 MB each due to bundled runtime.

## Troubleshooting

### Build fails
- Ensure Bun is installed: `curl -fsSL https://bun.sh/install | bash`
- Check Bun version: `bun --version`

### NSIS not found
- Install NSIS from https://nsis.sourceforge.io/
- Add to PATH or use full path to makensis

### MSI creation fails
- Install WiX Toolset: https://wixtoolset.org/
- Ensure `candle` and `light` commands are available
