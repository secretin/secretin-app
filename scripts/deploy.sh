#!/bin/bash

set -o nounset
set -o errexit

echo "Linting..."
CI=true npm test

echo "Building..."
yarn run build

echo "Pre-deploy tasks..."
cp build/index.html build/404.html

echo "Deploying..."
gh-pages -d build
