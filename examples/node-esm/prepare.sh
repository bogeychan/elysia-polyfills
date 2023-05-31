#!/bin/bash

# Cleanup
rm -fr node_modules package-lock.json

echo "Downloading..."

# Install dependencies
npm install

# Transpile a few `node_modules` packages to conform ESM
npm run transpile
