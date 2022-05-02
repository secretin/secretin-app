#!/bin/bash

set -o nounset
set -o errexit

echo "Installing..."
yarn install

echo "Linting..."
CI=true npm test

echo "Building..."
SKIP_PREFLIGHT_CHECK=true REACT_APP_API_SECRETIN=https://api.secret-in.me yarn run build

echo "Post build"
./post-build.sh

echo "Deploying..."
./node_modules/.bin/gh-pages -d build
