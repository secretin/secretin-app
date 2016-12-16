#!/bin/bash

set -o nounset
set -o errexit

echo "Linting..."
CI=true npm test

echo "Building..."
npm run build

echo "Pre-deploy tasks..."
# http://surge.sh/help/adding-a-200-page-for-client-side-routing
mv build/index.html build/200.html

echo "Deploying..."
surge build/
