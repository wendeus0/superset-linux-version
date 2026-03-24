#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd -- "${SCRIPT_DIR}/../../.." && pwd)"
AUR_DIR="${ROOT_DIR}/packaging/aur/superset-bin"
PKGBUILD_PATH="${AUR_DIR}/PKGBUILD"

if [[ ! -f "${PKGBUILD_PATH}" ]]; then
  echo "Missing ${PKGBUILD_PATH}. Run bump-aur.sh first."
  exit 1
fi

if ! command -v bash >/dev/null 2>&1; then
  echo "bash not available"
  exit 1
fi

echo "Checking PKGBUILD basic syntax..."
bash -n "${PKGBUILD_PATH}"

echo "Checking placeholders are fully resolved..."
if grep -qE '__VERSION__|__APPIMAGE_URL__|__APPIMAGE_SHA256__' "${PKGBUILD_PATH}"; then
  echo "Unresolved placeholders found in PKGBUILD"
  exit 1
fi

echo "Checking required fields..."
grep -q '^pkgname=superset-bin$' "${PKGBUILD_PATH}"
grep -q '^pkgver=' "${PKGBUILD_PATH}"
grep -q '^source_x86_64=' "${PKGBUILD_PATH}"
grep -q '^sha256sums_x86_64=' "${PKGBUILD_PATH}"

echo "AUR validation passed"
