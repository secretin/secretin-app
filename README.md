# Secretin
<img src="http://www.newmedia-fr.info/databank/photo_articles/jacquessecretin.jpg" alt="Jacques Secrétin" width="200"/>

Open source secret manager with groups management based on WebCryptoAPI http://www.w3.org/TR/WebCryptoAPI/

This repository contains the default client implementation.

* For the library holding secrets management logic, see https://github.com/secretin/secretin-lib
* For the windows native app, see https://github.com/secretin/secretin-windows
* For the default server implementation, see https://github.com/secretin/secretin-server

Installation guide on wiki or behinf : https://github.com/secretin/secretin-app/wiki

Don't hesitate to open issues !

## Build yourself
### Installing yarn
Follow the official yarn documentation : https://yarnpkg.com/en/docs/install

### Installing secretin-app

```
yarn install
REACT_APP_API_SECRETIN=https://api.your-secret-in.me yarn build
```

## Build electron package
REACT_APP_API_SECRETIN should define your secretin api server (default is http://devapi.secret-in.me:3000)

### Installing yarn

Follow the official yarn documentation : https://yarnpkg.com/en/docs/install

### Installing secretin-app
```
yarn install
REACT_APP_API_SECRETIN=https://api.your-secret-in.me yarn electron
```

REACT_APP_API_SECRETIN should define your secretin api server (default is http://devapi.secret-in.me:3000)

This will create `secretin-app-<OS>-<ARCH>` directory with secretin-app binary inside.

## Setup the app
Build yourself the app or download zipped files from our github pages (which host current https://secret-in.me)

https://github.com/secretin/secretin-app/archive/gh-pages.zip

Unzip it and serve content of `secretin-app-gh-pages/`

This branch is linked to https://api.secret-in.me, if you want to set your own api url, you can use this command 

```sed -i 's/https:\/\/api.secret-in.me/http:\/\/api.my-own-secret-in.me:3000/g' secretin-app-gh-pages/static/js/*.js ```

Be carefull to use secure origin to host the files (localhost for dev or https server) see https://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features

To support URL rewriting you can setup a catch-all rule or set 404 page on the index.html

### nginx
```error_page 404 /index.html;```
