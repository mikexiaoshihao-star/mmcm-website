#!/bin/bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
if [ ! -d node_modules/d3-geo ]; then
  npm install --no-audit --no-fund
fi
cd "$ROOT/build"
python3 build_data.py
node stamp.mjs
npx --prefix "$ROOT" esbuild ../src/c.js --bundle --format=iife --minify --outfile=../generated/atlas.js --log-level=warning
echo "map build ok"
