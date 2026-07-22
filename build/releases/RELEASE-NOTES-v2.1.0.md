# Release Notes - AI Job Search CLI v2.1.0

## What's New

### Standalone Executables
- **Windows .exe files** - Native Windows executables for all CLI tools
- **Linux binaries** - Standalone Linux executables
- **No runtime required** - Each executable is self-contained

### Included Tools

| Tool | Description | Windows | Linux |
|------|-------------|---------|-------|
| `indeed-search` | Search jobs on Indeed.com | ✅ | ✅ |
| `glassdoor-search` | Search jobs on Glassdoor with reviews | ✅ | ✅ |
| `stepstone-search` | Search jobs on StepStone (Europe) | ✅ | ✅ |
| `pakistan-search` | Search jobs on Pakistani portals | ✅ | ✅ |
| `india-search` | Search jobs on Indian portals | ✅ | ✅ |

## Download

### Windows
- **File:** `ai-job-search-windows-v2.1.0.zip` (70 MB)
- **Contains:** 5 .exe files + installer scripts

### Linux
- **File:** `ai-job-search-linux-portable.tar.gz` (172 MB)
- **Contains:** 5 Linux binaries

## Installation

### Windows (Easy)
1. Download `ai-job-search-windows-v2.1.0.zip`
2. Extract the ZIP file
3. Run `install.bat` as Administrator
4. Follow the prompts

### Windows (Manual)
1. Download `ai-job-search-windows-v2.1.0.zip`
2. Extract .exe files to a folder (e.g., `C:\AI-Job-Search`)
3. Add the folder to your PATH
4. Open a new command prompt

### Linux
```bash
# Extract
tar -xzf ai-job-search-linux-portable.tar.gz

# Make executable
chmod +x *

# Optional: Add to PATH
export PATH="$PWD:$PATH"
```

## Usage

```bash
# Search jobs on Indeed
indeed-search search -q "software engineer" -l "New York, NY" --format table

# Search jobs on Glassdoor with ratings
glassdoor-search search -q "data scientist" -l "Remote" --minrating 4 --format table

# Search jobs in Pakistan
pakistan-search search -q "developer" -l "Karachi" --format table

# Search jobs in India
india-search search -q "engineer" -l "Bangalore" --format table

# Search jobs in Europe
stepstone-search search -q "developer" -l "Berlin, Germany" --format table
```

## Building from Source

To build the latest version yourself:

```bash
# Clone the repository
git clone https://github.com/MadsLorentzen/ai-job-search.git
cd ai-job-search

# Install Bun
curl -fsSL https://bun.sh/install | bash

# Build Linux executables
./build/build.sh

# Build Windows executables (requires pkg)
npm install -g pkg
bun run build/build.ts
```

## What's Included in Each Package

### Windows Package
- `indeed-search.exe` - Indeed job search
- `glassdoor-search.exe` - Glassdoor job search with reviews
- `stepstone-search.exe` - StepStone job search (Europe)
- `pakistan-search.exe` - Pakistani job portals
- `india-search.exe` - Indian job portals
- `install.bat` - Easy installer script
- `uninstall.bat` - Uninstaller script
- `README.txt` - Installation instructions

### Linux Package
- `indeed-search` - Indeed job search
- `glassdoor-search` - Glassdoor job search with reviews
- `stepstone-search` - StepStone job search (Europe)
- `pakistan-search` - Pakistani job portals
- `india-search` - Indian job portals

## Support

- **Issues:** https://github.com/MadsLorentzen/ai-job-search/issues
- **Documentation:** https://github.com/MadsLorentzen/ai-job-search/tree/master/README.md

## License

MIT License - See [LICENSE](LICENSE) for details.
