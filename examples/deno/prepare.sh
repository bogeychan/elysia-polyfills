#!/bin/bash

# Cleanup
rm -fr node_modules deno.lock

# Try to run (this shall fail & create a `node_modules` folder)
deno task start &> /dev/null

# Transpile a few `node_modules` packages to conform ESM
../../bin/cli.js
# ./node_modules/@bogeychan/elysia-polyfills/bin/cli.js