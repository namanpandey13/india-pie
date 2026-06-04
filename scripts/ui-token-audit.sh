#!/usr/bin/env bash
set -euo pipefail

TMP_FILE="$(mktemp)"

rg -n "fontFamily: '|fontWeight: '|fontSize: [0-9]|lineHeight: [0-9]" apps/mobile packages/ui \
  --glob '!apps/mobile/app.json' \
  --glob '!apps/mobile/env.d.ts' \
  > "$TMP_FILE" || true

if [[ -s "$TMP_FILE" ]]; then
  echo "Found raw typography values outside design tokens. Use typographyRoles/componentTokens."
  cat "$TMP_FILE"
  rm "$TMP_FILE"
  exit 1
fi

rg -n "#[0-9A-Fa-f]{3,8}|rgba\\(" apps/mobile packages \
  --glob '!apps/mobile/app.json' \
  --glob '!packages/design-tokens/src/index.ts' \
  > "$TMP_FILE" || true

if [[ -s "$TMP_FILE" ]]; then
  echo "Found raw color values outside design tokens."
  cat "$TMP_FILE"
  rm "$TMP_FILE"
  exit 1
fi

rm "$TMP_FILE"
echo "UI token audit passed."
