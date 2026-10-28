#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")/../../.."
node src/map/build/build.mjs
