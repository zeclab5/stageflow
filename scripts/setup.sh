#!/bin/bash
set -e
if [ -d node_modules ]; then
  echo "node_modules exists"
else
  npm ci
fi
