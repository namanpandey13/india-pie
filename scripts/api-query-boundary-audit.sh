#!/usr/bin/env bash
set -euo pipefail

matches="$(rg -n "\\.from<|\\.from\\(" packages/api/src apps/mobile \
  --glob '!packages/api/src/queries/**' \
  --glob '!packages/api/src/client.ts' || true)"

if [ -n "$matches" ]; then
  echo "Found Supabase table queries outside packages/api/src/queries."
  echo "$matches"
  exit 1
fi

echo "API query boundary audit passed."
