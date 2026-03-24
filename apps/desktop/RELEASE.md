# Desktop App Release Process

## Quick Start

From the monorepo root:

```bash
./apps/desktop/create-release.sh
```

The script will:
1. Show current version and prompt for new version (patch/minor/major/custom)
2. Update `package.json` version
3. Create and push a `desktop-v<version>` tag
4. Monitor the GitHub Actions build
5. Create a **draft release** for review

### Options

```bash
# Interactive version selection (recommended)
./apps/desktop/create-release.sh

# Explicit version
./apps/desktop/create-release.sh 0.0.50

# Auto-publish (skip draft)
./apps/desktop/create-release.sh --publish
./apps/desktop/create-release.sh 0.0.50 --publish
```

To publish a draft:

```bash
gh release edit desktop-v0.0.50 --draft=false
```

### Requirements

- GitHub CLI (`gh`) installed and authenticated
- Clean git working directory

## Manual Release

If you prefer not to use the script:

```bash
git tag desktop-v1.0.0
git push origin desktop-v1.0.0
```

This creates a draft release. Publish it manually at GitHub Releases.

## Auto-update

The app checks for updates at launch and every x hours using:

- **macOS manifest**: `https://github.com/superset-sh/superset/releases/latest/download/latest-mac.yml`
- **Linux manifest**: `https://github.com/superset-sh/superset/releases/latest/download/latest-linux.yml`
- **macOS installer**: `https://github.com/superset-sh/superset/releases/latest/download/Superset-arm64.dmg`
- **Linux installer (AppImage)**: `https://github.com/superset-sh/superset/releases/latest/download/Superset-x86_64.AppImage`
- **Linux installer (.deb)**: `https://github.com/superset-sh/superset/releases/latest/download/Superset-amd64.deb`

The workflow creates stable-named copies (without version) so these URLs always point to the latest build.

## Code Signing

macOS code signing uses these repository secrets:

- `MAC_CERTIFICATE` / `MAC_CERTIFICATE_PASSWORD`
- `APPLE_ID` / `APPLE_ID_PASSWORD` / `APPLE_TEAM_ID`

## Local Testing

```bash
cd apps/desktop
bun run clean:dev
bun run compile:app
bun run package
```

Output: `apps/desktop/release/`

Linux output should include:

- `*.AppImage`
- `*.deb`
- `*-linux.yml` (auto-update manifest)

## AUR (`superset-bin`) base workflow

This repository includes a deterministic base flow for AUR package maintenance:

```bash
# Generate PKGBUILD from template + GitHub release asset checksum
./packaging/aur/scripts/bump-aur.sh <version>

# Validate generated PKGBUILD
./packaging/aur/scripts/validate-aur.sh
```

Notes:
- The script defaults to `Superset-x86_64.AppImage` from `desktop-v<version>` release tag.
- Publication to AUR remains manual in this phase (no credential automation).

## Troubleshooting

- **Linux auto-update not working**: Verify `release/*-linux.yml` is uploaded to the GitHub release
- **Linux .deb missing from release**: Check `build-desktop.yml` Linux artifact validation step for `.deb`
- **Build icon warnings/failures**: Add icons under `src/resources/build/icons/` (`icon.icns`, `icon.ico`, optional Linux `.png`)
- **Native module errors**: Ensure `node-pty` is in externals in both `electron.vite.config.ts` and `electron-builder.ts`
