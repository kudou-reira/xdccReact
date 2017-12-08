import path from 'path';
import url from 'url';
import {app, crashReporter, BrowserWindow, Menu, ipcMain, shell } from 'electron';
const { requireTaskPool } = require('electron-remote');
const fetchSuggestions = requireTaskPool(require.resolve('./childProcesses/fetchSuggestions'));
const sendQueue = requireTaskPool(require.resolve('./childProcesses/sendQueue'));

const axios = require('axios');
const _ = require('lodash');
var os = require('os');

const isDevelopment = (process.env.NODE_ENV === 'development');
process.env.GOOGLE_API_KEY = "AIzaSyCpdUeRmQD8ICPR6IWT-tUGQUBTxdGY404";

let mainWindow = null;
let downloadWindow = null;
let forceQuit = false;

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const extensions = [
    'REACT_DEVELOPER_TOOLS',
    'REDUX_DEVTOOLS'
  ];
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  for (const name of extensions) {
    try {
      await installer.default(installer[name], forceDownload);
    } catch (e) {
      console.log(`Error installing ${name} extension: ${e.message}`);
    }
  }
};

crashReporter.start({
  productName: 'YourName',
  companyName: 'YourCompany',
  submitURL: 'https://your-domain.com/url-to-submit',
  uploadToServer: false
});

app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', async () => {
  if (isDevelopment) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({ 
    width: 1400, 
    height: 800,
    minWidth: 640,
    minHeight: 480,
    show: false ,
    nativeWindowOpen: true
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // show window once on first load
  mainWindow.webContents.once('did-finish-load', () => {
    mainWindow.show();
  });

  mainWindow.webContents.on('did-finish-load', () => {
    // Handle window logic properly on macOS:
    // 1. App should not terminate if window has been closed
    // 2. Click on icon in dock should re-open the window
    // 3. ⌘+Q should close the window and quit the app
    if (process.platform === 'darwin') {
      mainWindow.on('close', function (e) {
        if (!forceQuit) {
          e.preventDefault();
          mainWindow.hide();
        }
      });

      app.on('activate', () => {
        mainWindow.show();
      });
      
      app.on('before-quit', () => {
        forceQuit = true;
      });
    } else {
      mainWindow.on('closed', () => {
        mainWindow = null;
      });
    }
  });

  downloadWindow = new BrowserWindow({ 
    width: 1000, 
    height: 800,
    minWidth: 640,
    minHeight: 480,
    show: false ,
    nativeWindowOpen: true,
    title: 'Download List'
  });

  downloadWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  downloadWindow.webContents.on('did-finish-load', () => {
    // Handle window logic properly on macOS:
    // 1. App should not terminate if window has been closed
    // 2. Click on icon in dock should re-open the window
    // 3. ⌘+Q should close the window and quit the app
    if (process.platform === 'darwin') {
      downloadWindow.on('close', function (e) {
        if (!forceQuit) {
          e.preventDefault();
          downloadWindow.hide();
        }
      });

      app.on('activate', () => {
        downloadWindow.show();
      });
      
      app.on('before-quit', () => {
        forceQuit = true;
      });
    } else {
      downloadWindow.on('close', function (e) {
        e.preventDefault();
        downloadWindow.hide();
        // downloadWindow = null;
      });
    }
  });

  // mainWindow.webContents.on('new-window', (event, url, frameName, disposition, options, additionalFeatures) => {
  //   // open window as modal
  //   event.preventDefault()
  //   Object.assign(options, {
  //     parent: mainWindow,
  //     width: 1000, 
  //     height: 800,
  //     minWidth: 640,
  //     minHeight: 480
  //   })
  //   event.newGuest = new BrowserWindow(options)
  // })

  if (isDevelopment) {
    // auto-open dev tools
    mainWindow.webContents.openDevTools();

    // add inspect element on right click menu
    mainWindow.webContents.on('context-menu', (e, props) => {
      Menu.buildFromTemplate([{
        label: 'Inspect element',
        click() {
          mainWindow.inspectElement(props.x, props.y);
        }
      }]).popup(mainWindow);
    });
  }
});

ipcMain.on('videos:added', (event, videos) => {
  // console.log(videos);

  // const promise = new Promise((resolve, reject) => {
  //  ffmpeg.ffprobe(videos[0].path, (err, metadata) => {
  //    // console.log(metadata);
  //    resolve(metadata);
  //  });
  // });

  // promise.then((metadata) => {
  //  console.log(metadata);
  // });

  // return an array of promises
  const promises = _.map(videos, (video) =>  {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(video.path, (err, metadata) => {
        video.duration = metadata.format.duration;
        video.format = 'avi';
        resolve(video);
      });
    });
  });

  Promise.all(promises)
    .then((results) => {
      // console.log(results);
      // results is an array of information
      mainWindow.webContents.send('metadata:complete', results);
    });
});


ipcMain.on('fetch:suggestions', (e, suggestion) => {
  console.log('start fetchSuggestions');
  fetchSuggestions(suggestion).then((result) => {
    mainWindow.webContents.send('fetch:suggestionsDone', result);
  });
});

ipcMain.on('send:queue', (e, queue) => {
  console.log('this is sendQueue');

  sendQueue(queue).then((result) => {
    console.log("these are sendQueue results", result);
    mainWindow.webContents.send('send:queueDone', result);
    // might have to send to another window too
    downloadWindow.show();
    downloadWindow.webContents.send('send:queueDone', result);
  });
});

// ipcMain.on('downloadWindow:queue', (e, queue) => {
//   downloadWindow.show();
//   downloadWindow.webContents.send('downloadWindow:queueDone', queue);
// });



 
var interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}

console.log(addresses);



ipcMain.on('folder:open', (event, outputPath) => {
  shell.showItemInFolder(outputPath);
});
