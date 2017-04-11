/* eslint-disable no-param-reassign */

const electron = require('electron');

// Module to control application life.
const { app, protocol } = electron;
// Module to create native browser window.
const { BrowserWindow } = electron;
const path = require('path');

// const menu = new Menu();
// Menu.setApplicationMenu(menu);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
let api = 'http://devapi.secret-in.me:3000';
const prefix = 'file';
process.argv.forEach((argv) => {
  if (argv.startsWith('--secretin-api')) {
    api = argv.substring(15);
  }
});

function createWindow() {
  protocol.interceptFileProtocol(prefix, (request, callback) => {
    if (request.url.indexOf('/static/') > -1) {
      const url = request.url.split('/static/')[1];
      callback({ path: path.join(__dirname, 'build/static', decodeURI(url)) });
    } else {
      callback({ path: path.join(__dirname, 'build/index.html') });
    }
  });

  // Create the browser window.
  win = new BrowserWindow({
    width: 1000,
    height: 800,
  });
  // and load the index.html of the app.
  win.loadURL(`file://${__dirname}/build/index.html?api=${api}`);

  // Open the DevTools.
  // win.webContents.openDevTools();

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  win.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    electron.shell.openExternal(url);
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});
