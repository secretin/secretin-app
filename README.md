# Secretin
![Jacques Secrétin](http://www.echo62.com/images/sportif/sportif48.jpg)

Open source secret manager with groups management based on WebCryptoAPI http://www.w3.org/TR/WebCryptoAPI/

This repository contains the default client implementation.

* For the library holding secrets management logic, see https://github.com/secretin/secretin-lib
* For the windows native app, see https://github.com/secretin/secretin-windows
* For the default server implementation, see https://github.com/secretin/secretin-server

# Install

```
yarn install
yarn start
```
There is a dependency on secretin-lib, which is not available yet in npm.
See instructions for install here :
https://github.com/secretin/secretin-lib/README.md#install

then, use `yarn link` to link the library.
