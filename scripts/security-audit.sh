#!/usr/bin/env bash
set -euo pipefail

if rg --hidden --glob '!node_modules/**' --glob '!**/dist/**' --glob '!**/.expo/**' --glob '!**/.turbo/**' \
  --glob '!package-lock.json' \
  --glob '!.env.example' \
  --glob '!scripts/security-audit.sh' \
  --glob '!scripts/tracked-file-audit.sh' \
  '(-----BEGIN (RSA |OPENSSH |EC |DSA |PRIVATE )?PRIVATE KEY-----|SUPABASE_SERVICE_ROLE_KEY=.+|EXPO_PUBLIC_SUPABASE_ANON_KEY=.+|access_token=|refresh_token=|console\.log\(.*OAuth|console\.log\(.*Callback URL|sk_live_|sk_test_|ghp_[A-Za-z0-9_]+|github_pat_[A-Za-z0-9_]+|AIza[0-9A-Za-z_-]{35})' .; then
  echo "Potential secret material found. Review each match before pushing."
  exit 1
fi

echo "No common secret patterns found."
