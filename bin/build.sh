#!/usr/bin/env bash
npx babel-node bin/pre-build
npx babel index.js --out-file index.js
npx babel-node bin/post-build
