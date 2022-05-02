echo "Pre-deploy tasks..."
cp build/index.html build/404.html

echo "const SECRETIN_APP_COMMIT = '$(git rev-parse HEAD)';" > build/app-version.js