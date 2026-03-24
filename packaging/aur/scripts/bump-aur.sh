#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd -- "${SCRIPT_DIR}/../../.." && pwd)"
TEMPLATE_PATH="${ROOT_DIR}/packaging/aur/superset-bin/PKGBUILD.template"
OUTPUT_PATH="${ROOT_DIR}/packaging/aur/superset-bin/PKGBUILD"

if [[ $# -lt 1 || $# -gt 2 ]]; then
  echo "Usage: $0 <version> [appimage_url]"
  echo "Example: $0 1.3.2"
  echo "Example: $0 1.3.2 https://github.com/superset-sh/superset/releases/download/desktop-v1.3.2/Superset-x64.AppImage"
  exit 1
fi

VERSION="$1"
APPIMAGE_URL="${2:-https://github.com/superset-sh/superset/releases/download/desktop-v${VERSION}/Superset-x86_64.AppImage}"

if [[ ! -f "${TEMPLATE_PATH}" ]]; then
  echo "Template not found: ${TEMPLATE_PATH}"
  exit 1
fi

tmp_file="$(mktemp)"
trap 'rm -f "$tmp_file"' EXIT

echo "Downloading AppImage for checksum..."
curl -L --fail --silent --show-error "$APPIMAGE_URL" -o "$tmp_file"

APPIMAGE_SHA256="$(sha256sum "$tmp_file" | awk '{print $1}')"

echo "Generating PKGBUILD..."
sed \
  -e "s|__VERSION__|${VERSION}|g" \
  -e "s|__APPIMAGE_URL__|${APPIMAGE_URL}|g" \
  -e "s|__APPIMAGE_SHA256__|${APPIMAGE_SHA256}|g" \
  "$TEMPLATE_PATH" > "$OUTPUT_PATH"

echo "PKGBUILD generated at: ${OUTPUT_PATH}"
echo "Version: ${VERSION}"
echo "URL: ${APPIMAGE_URL}"
echo "SHA256: ${APPIMAGE_SHA256}"
