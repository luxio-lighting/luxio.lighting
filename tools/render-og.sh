#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")/.."
profile=$(mktemp -d /tmp/luxio-og-chrome.XXXXXX)
trap 'rm -rf "$profile"' EXIT
"${CHROME_BIN:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}" \
  --headless --disable-gpu --no-first-run --no-default-browser-check \
  --user-data-dir="$profile" --allow-file-access-from-files --hide-scrollbars \
  --force-device-scale-factor=1 --window-size=1200,630 --virtual-time-budget=3000 \
  --screenshot="$PWD/img/og-image.png" "file://$PWD/tools/og-image.html"
