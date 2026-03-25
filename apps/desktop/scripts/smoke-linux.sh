#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
DESKTOP_DIR="$(cd -- "${SCRIPT_DIR}/.." && pwd)"
ROOT_DIR="$(cd -- "${DESKTOP_DIR}/../.." && pwd)"

PROFILE="generic"
SKIP_INSTALL=0
WITH_PACKAGE=0
CI_MODE=0

usage() {
  cat <<'EOF'
Usage: smoke-linux.sh [options]

Reproducible Linux smoke suite for Superset Desktop.

Options:
  --profile <generic|ubuntu|arch>  Target distro profile (default: generic)
  --skip-install                   Skip dependency install steps
  --with-package                   Build release artifacts and validate AppImage/.deb/manifest
  --ci                             CI mode (compact logs)
  -h, --help                       Show this help
EOF
}

log() {
  local msg="$1"
  if [[ "$CI_MODE" -eq 1 ]]; then
    echo "[smoke-linux] $msg"
  else
    echo
    echo "==> $msg"
  fi
}

fail() {
  echo "[smoke-linux] ERROR: $1" >&2
  exit 1
}

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || fail "Command not found: $1"
}

resolve_bun() {
  if command -v bun >/dev/null 2>&1; then
    command -v bun
    return 0
  fi

  if [[ -x "${HOME}/.bun/bin/bun" ]]; then
    echo "${HOME}/.bun/bin/bun"
    return 0
  fi

  fail "bun not found in PATH or ~/.bun/bin/bun"
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --profile)
      PROFILE="${2:-}"
      [[ -n "$PROFILE" ]] || fail "Missing value for --profile"
      shift 2
      ;;
    --skip-install)
      SKIP_INSTALL=1
      shift
      ;;
    --with-package)
      WITH_PACKAGE=1
      shift
      ;;
    --ci)
      CI_MODE=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      fail "Unknown argument: $1"
      ;;
  esac
done

case "$PROFILE" in
  generic|ubuntu|arch) ;;
  *) fail "Invalid profile '$PROFILE'. Use: generic, ubuntu, arch" ;;
esac

log "Preflight checks"
require_cmd bash
BUN_BIN="$(resolve_bun)"
echo "[smoke-linux] Using bun: ${BUN_BIN}"

if [[ "$(uname -s)" != "Linux" ]]; then
  fail "This smoke suite must run on Linux"
fi

case "$PROFILE" in
  ubuntu)
    command -v apt-get >/dev/null 2>&1 || fail "Ubuntu profile selected, but apt-get not found"
    ;;
  arch)
    command -v pacman >/dev/null 2>&1 || fail "Arch profile selected, but pacman not found"
    ;;
esac

if [[ "$SKIP_INSTALL" -eq 0 ]]; then
  log "Installing workspace dependencies"
  (
    cd "$ROOT_DIR"
    "${BUN_BIN}" install --frozen --ignore-scripts
  )

  log "Installing desktop native dependencies"
  (
    cd "$DESKTOP_DIR"
    "${BUN_BIN}" run install:deps
  )
else
  log "Skipping install steps (--skip-install)"
fi

log "Generating file icons manifest"
(
  cd "$DESKTOP_DIR"
  "${BUN_BIN}" run generate:icons
)

log "Compiling desktop app"
(
  cd "$DESKTOP_DIR"
  SUPERSET_WORKSPACE_NAME=superset "${BUN_BIN}" run compile:app
)

log "Validating Linux native runtime invariants"
(
  cd "$DESKTOP_DIR"
  TARGET_PLATFORM=linux TARGET_ARCH=x64 "${BUN_BIN}" run copy:native-modules
  TARGET_PLATFORM=linux TARGET_ARCH=x64 "${BUN_BIN}" run validate:native-runtime
)

if [[ "$WITH_PACKAGE" -eq 1 ]]; then
  log "Building Linux release artifacts"
  (
    cd "$DESKTOP_DIR"
    "${BUN_BIN}" run package -- --publish never --config electron-builder.ts
  )

  log "Validating Linux release artifacts"
  (
    cd "$DESKTOP_DIR"

    shopt -s nullglob
    appimages=(release/*.AppImage)
    debs=(release/*.deb)
    manifests=(release/*-linux.yml)
    shopt -u nullglob

    [[ ${#appimages[@]} -gt 0 ]] || fail "No AppImage found in apps/desktop/release"
    [[ ${#debs[@]} -gt 0 ]] || fail "No .deb found in apps/desktop/release"
    [[ ${#manifests[@]} -gt 0 ]] || fail "No *-linux.yml manifest found in apps/desktop/release"

    echo "[smoke-linux] Artifacts found:"
    printf '  - %s\n' "${appimages[@]}"
    printf '  - %s\n' "${debs[@]}"
    printf '  - %s\n' "${manifests[@]}"
  )
else
  log "Skipping packaging/artifact validation (enable with --with-package)"
fi

log "Smoke suite finished successfully (profile=${PROFILE})"
