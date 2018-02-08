import path from 'path';
import url from 'url';
import {app, crashReporter, BrowserWindow, Menu, ipcMain, shell, dialog } from 'electron';

// var app = require('electron').remote; 
// var dialog = app.dialog;

// // Or with ECMAScript 6
// const { dialog } = require('electron').remote;

const Store = require('electron-store');
const store = new Store();

const { requireTaskPool } = require('electron-remote');
const fetchAnime = requireTaskPool(require.resolve('./childProcesses/fetchAnime'));
const fetchContinuingAnime = requireTaskPool(require.resolve('./childProcesses/fetchContinuingAnime'));
const fetchSuggestions = requireTaskPool(require.resolve('./childProcesses/fetchSuggestions'));
const sendQueue = requireTaskPool(require.resolve('./childProcesses/sendQueue'));
const startDownloads = requireTaskPool(require.resolve('./childProcesses/startDownloads'));

const async = require('async');
const axios = require('axios');
const _ = require('lodash');
var os = require('os');

// set a global path variable
var folderPath = store.get('storedPath') === null ? process.cwd() : store.get('storedPath');
console.log("this is the stored folder path", folderPath);

const isDevelopment = (process.env.NODE_ENV === 'development');
process.env.GOOGLE_API_KEY = "AIzaSyCpdUeRmQD8ICPR6IWT-tUGQUBTxdGY404";

let mainWindow = null;
let downloadWindow = null;
let downloadingWindow = null;

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

    let windowTitle = 'XDCC Search';
    mainWindow.setTitle(windowTitle);

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
    width: 1400, 
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
    let windowTitle = 'Download List';
    downloadWindow.setTitle(windowTitle);

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

  downloadingWindow = new BrowserWindow({ 
    width: 750, 
    height: 600,
    minWidth: 640,
    minHeight: 480,
    show: false ,
    nativeWindowOpen: true,
    title: 'Download List'
  });

  downloadingWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  downloadingWindow.webContents.on('did-finish-load', () => {
    // Handle window logic properly on macOS:
    // 1. App should not terminate if window has been closed
    // 2. Click on icon in dock should re-open the window
    // 3. ⌘+Q should close the window and quit the app
    let windowTitle = 'Downloading';
    downloadingWindow.setTitle(windowTitle);

    if (process.platform === 'darwin') {
      downloadingWindow.on('close', function (e) {
        if (!forceQuit) {
          e.preventDefault();
          downloadWindow.hide();
        }
      });

      app.on('activate', () => {
        downloadingWindow.show();
      });
      
      app.on('before-quit', () => {
        forceQuit = true;
      });
    } else {
      downloadingWindow.on('close', function (e) {
        e.preventDefault();
        downloadingWindow.hide();
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

    downloadWindow.webContents.openDevTools();

    // add inspect element on right click menu
    downloadWindow.webContents.on('context-menu', (e, props) => {
      Menu.buildFromTemplate([{
        label: 'Inspect element',
        click() {
          downloadWindow.inspectElement(props.x, props.y);
        }
      }]).popup(downloadWindow);
    });

    downloadingWindow.webContents.openDevTools();

    // add inspect element on right click menu
    downloadingWindow.webContents.on('context-menu', (e, props) => {
      Menu.buildFromTemplate([{
        label: 'Inspect element',
        click() {
          downloadingWindow.inspectElement(props.x, props.y);
        }
      }]).popup(downloadingWindow);
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

ipcMain.on('fetch:anime', (e, season, year) => {
  console.log("this is fetchAnime", season, year);
  var xdccAnilist;
  if(isDevelopment) {
    xdccAnilist = "http://localhost:8080/xdccAnilist";
  }

  else {
    xdccAnilist = "https://immense-beyond-13018.herokuapp.com/xdccAnilist"
  }

  fetchAnime(season, year, xdccAnilist).then((result) => {
    mainWindow.webContents.send('fetch:animeDone', result);
  });
});

ipcMain.on('fetch:continuingAnime', (e, season, year) => {
  console.log("this is fetchContinuingAnime", season, year);
  var xdccAnilist;
  if(isDevelopment) {
    xdccAnilist = "http://localhost:8080/xdccAnilist";
  }

  else {
    xdccAnilist = "https://immense-beyond-13018.herokuapp.com/xdccAnilist"
  }

  fetchContinuingAnime(season, year, xdccAnilist).then((result) => {
    console.log("this is the result from fetchContinuingAnime", result);
    mainWindow.webContents.send('fetch:continuingAnimeDone', result);
  });
});

ipcMain.on('fetch:suggestions', (e, suggestion) => {
  console.log('start fetchSuggestions');
  var xdccTempSearch;
  if(isDevelopment) {
    xdccTempSearch = "http://localhost:8080/xdccTempSearch";
  }

  else {
    xdccTempSearch = "https://immense-beyond-13018.herokuapp.com/xdccTempSearch"
  }

  fetchSuggestions(suggestion, xdccTempSearch).then((result) => {
    mainWindow.webContents.send('fetch:suggestionsDone', result);
  });
});

ipcMain.on('send:queue', (e, queue) => {
  var xdccBotSearch;
  if(isDevelopment) {
    xdccBotSearch = "http://localhost:8080/xdccBotSearch";
  }

  else {
    xdccBotSearch = "https://immense-beyond-13018.herokuapp.com/xdccBotSearch"
  }

  sendQueue(queue, xdccBotSearch).then((result) => {
    mainWindow.webContents.send('send:queueDone', result);
    // might have to send to another window too
    downloadWindow.show();
    downloadWindow.webContents.send('send:queueDone', result);
  });
});

ipcMain.on('start:downloads', (e, queue) => {
  var xdccOptimizeDL;
  if(isDevelopment) {
    xdccOptimizeDL = "http://localhost:8080/xdccOptimizeDL";
  }

  else {
    xdccOptimizeDL = "https://immense-beyond-13018.herokuapp.com/xdccOptimizeDL"
  }

  console.log("this is the start downloads in ipcMain", queue);

  startDownloads(queue, xdccOptimizeDL).then((result) => {
    downloadWindow.webContents.send('start:downloadsDone', result);
    // create irc client here?
    downloadingWindow.show();
    downloadingWindow.webContents.send('start:downloadsDone', result);

    // result has to send back the chopped up bots into 2
    console.log("this is the length of result in ipcMain", result.optimizedBots.length);
    console.log("these are the values in result", result);

    // add channels to search through channels array!!!
    // for now, added default channels to join, but there is possible edge case that a channel won't exist
    var channels = [];

    // for (var i = 0; i < result.optimizedBots.length; i++) {
    //   for (var j = 0; j < result.optimizedBots[i].length; j++) {
    //     var singleBotChannel = result.optimizedBots[i][j].channelToUse;
    //     var singleTask = botInstance.xdcc({ botNick: singleBot.BotToUse, packId: singleBot.PackNumber })
    //       .then(function(xdccInstance) {})
    //       .catch(function(err) {
    //           if(err.code) {
    //               console.error('Error ' + err.code + ': ' +  err.message);
    //           }
    //           else {
    //               console.error(err);
    //           }
    //       });
    //     containerTasks.push(singleTask);
    //   }
    //   allTasks.push(containerTasks)
    //   containerTasks = [];
    // }

    var containerTasks = [];
    var allTasks = [];

    var ircXdcc = require('irc-xdcc')
    // set options object
      , ircOptions = {
            userName: 'ircClient'
          , realName: 'irc Client'
          , port: 6697
          , autoRejoin: true
          , autoConnect: true
          , channels: [ '#HorribleSubs', '#Exiled-Destiny', '#Anime-Koi', '#commie-subs', '#doki', '#evetaku', '#FFFpeeps', '#UNDERWATER', '#UTW', '#vivid', '#WhyNot?', '#KickAssAnime']
          , secure: true
          , selfSigned: true
          , certExpired: true
          , stripColors: true
          , encoding: 'UTF-8'
          // xdcc specific options
          , progressInterval: 3
          , destPath: folderPath
          , resume: false
          , acceptUnpooled: true
          , closeConnectionOnDisconnect: false
        }
    // used to store bot instance
      , botInstance
      ;

    ircXdcc('irc.rizon.net', 'myBotNick', ircOptions)
      .then(function(instance) {
        // a way would be to make botInstance1, botInstance2, botInstance3, botInstance4, etc
        // measure the array of calls you get
        botInstance = instance;


        botInstance.addListener('registered', function() { console.log('bot connected'); });
        botInstance.addListener('xdcc-progress', function(xdccInstance, progress) {
          // console.log("this is xdccInstance", xdccInstance);
          var percent = progress/xdccInstance.xdccInfo.fileSize * 100;
          var fileName = xdccInstance.xdccInfo.fileName;
          var dataProgress = {
            fileName: fileName,
            percent: percent,
            completed: false
          }

          console.log("this is the progress of the file named", fileName);
          console.log(percent);
          downloadingWindow.webContents.send('connect:XDCC', dataProgress);
        });

        botInstance.addListener('xdcc-dlerror', function(xdccInstance) {
          console.log("xdcc download is complete for", xdccInstance.xdccInfo.fileName);
          var fileName = xdccInstance.xdccInfo.fileName + " has encountered an error";
          var dataProgress = {
            fileName: fileName,
            error: xdccInstance.xdccInfo.error,
            completed: false
          }
          downloadingWindow.webContents.send('connect:XDCC', dataProgress);
        });

        botInstance.addListener('xdcc-complete', function(xdccInstance) {
          console.log("xdcc download is complete for", xdccInstance.xdccInfo.fileName);
          var fileName = xdccInstance.xdccInfo.fileName
          var dataProgress = {
            fileName: fileName,
            completed: true,
            filePath: xdccInstance.xdccInfo.location
          }
          downloadingWindow.webContents.send('connect:XDCC', dataProgress);
        });

        for (var i = 0; i < result.optimizedBots.length; i++) {
          for (var j = 0; j < result.optimizedBots[i].length; j++) {
            var singleBot = result.optimizedBots[i][j];
            var singleTask = botInstance.xdcc({ botNick: singleBot.BotToUse, packId: singleBot.PackNumber })
              .then(function(xdccInstance) {})
              .catch(function(err) {
                  if(err.code) {
                      console.error('Error ' + err.code + ': ' +  err.message);
                  }
                  else {
                      console.error(err);
                  }
              });
            containerTasks.push(singleTask);
          }
          allTasks.push(containerTasks)
          containerTasks = [];
        }

        console.log("this is allTasks", allTasks);

        var allParallel = [];

        for(var k = 0; k < allTasks.length; k++) {
          var singleParallel = async.parallel(allTasks[k], function(err, results) {
            console.log("this is the tasks parallel");
            console.log("these are the results in tasks parallel", results);
          });
          allParallel.push(singleParallel);
        }

        // unused
        async.parallel(test1, function(err, results) {
          console.log("this is the tasks parallel");
          console.log("these are the results in tasks parallel", results);
        });
    })
    .catch(console.error.bind(console));

  });

});
 
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
var fullPath = __dirname;
console.log("this is path", fullPath);

console.log("this is processsssssssssssssssssssss", process.cwd());


ipcMain.on('shell:default', (event, empty) => {
  console.log("this is shell default");
  console.log("this should be default test", empty);
  mainWindow.webContents.send('shell:defaultDone', folderPath);
});



ipcMain.on('shell:open', (event, empty) => {
  console.log("this is shell open");
  console.log("this should be test", empty);

  dialog.showOpenDialog({
      title:"Select a folder",
      defaultPath: folderPath,
      properties: ["openDirectory"]
  }, (folderPaths) => {
      // folderPaths is an array that contains all the selected paths
      if(folderPaths === undefined){
          console.log("No destination folder selected");
          console.log("this is folderpaths", folderPaths);
          store.set('storedPath', folderPath);
          mainWindow.webContents.send('shell:openDone', folderPath);
      }

      else {
          console.log(folderPaths);
          folderPath = folderPaths[0];
          store.set('storedPath', folderPath);
          mainWindow.webContents.send('shell:openDone', folderPath);
      }

      // send back webcontents
      // downloadWindow.webContents.send('send:queueDone', result);
  });

  // shell.showItemInFolder(process.cwd());
});

