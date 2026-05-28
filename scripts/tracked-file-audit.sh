#!/usr/bin/env bash
set -euo pipefail

pattern='(^|/)(node_modules|dist|\.expo|\.turbo)(/|$)|\.tsbuildinfo$|(^|/)\.env($|\.)|\.pem$|\.key$|\.p8$|\.p12$|google-services\.json|GoogleService-Info\.plist'

if git ls-files | rg "$pattern" | rg -v '(^|/)\.env\.example$'; then
  echo "Tracked generated or sensitive files found. Remove them with git rm --cached <path>."
  exit 1
fi

echo "No tracked generated or sensitive files found."
