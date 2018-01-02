import path from 'path';
import url from 'url';
import {app, crashReporter, BrowserWindow, Menu, ipcMain, shell } from 'electron';


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
    width: 1000, 
    height: 600,
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


    var containerTasks = [];
    var allTasks = [];
    for (var i = 0; i < result.optimizedBots.length; i++) {
      for (var j = 0; j < result.optimizedBots[i].length; j++) {
        var singleBot = result.optimizedBots[i][j];
        var singleTask = startXDCC.bind(null, singleBot);
        containerTasks.push(singleTask);
      }
      allTasks.push(containerTasks)
      containerTasks = [];
    }

    console.log("this is allTasks", allTasks);
    // all tasks has pairs of tasks now

    var allParallel = [];



    // why doesn't this work...
    // for(var k = 0; k < allTasks.length; k++) {
    //   var singleParallel = async.parallel(allTasks[k], function(err, results) {
    //     console.log("this is the tasks parallel");
    //     console.log("these are the results in tasks parallel", results);
    //   });
    //   allParallel.push(singleParallel);
    // }

    var test1 = allTasks[0];
    console.log("this is alltasks[0]", test1);

    // unused
    async.parallel(test1, function(err, results) {
      console.log("this is the tasks parallel");
      console.log("these are the results in tasks parallel", results);
    });



    // console.log("this is all parallel", allParallel);

    // async.series(allParallel, function(err, results) {
    //   console.log("this is the async series");
    //   console.log("this is the async series results", results);
    // });


    // async.eachSeries(allParallel, function (eachParallel, done) {
    //     setTimeout(function () {
    //        eachParallel;
    //        done();
    //     }, 300000);
    // }, function (err) {
      
    // });








    // trying out whilst

    // var i = 0;
    // async.whilst(
    //   // test to perform next iteration
    //   function() { return i <= allParallel.length-1; },

    //   // iterated function
    //   // call `innerCallback` when the iteration is done
    //   function(innerCallback) {
    //       allParallel[i];

    //       setTimeout(function() { i++; innerCallback(); }, 300000);
    //   },

    //   // when all iterations are done, call `callback`
    //   callback
    // );





      //     var singleBot = result.optimizedBots[i];
      // // arguments are not bound to startXDCC!!!!
      // var singleTask = startXDCC.bind(null, singleBot);
      // tasks.push(singleTask);

    // console.log("this is the tasks array", tasks);
    

    // now that you have the tasks array, cut it all up by twos
    // maybe should cut it up in the back end

    // console.log("going to start connection to irc");

    // async.parallel(tasks, function(err, results) {
    //   console.log("this is the tasks parallel");
    // });
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

function startXDCC(singleBot, callback) {

  // console.log("this is singleBot in connect xdcc", singleBot);

  // console.log("this is singleBot bot to use", singleBot.BotToUse);
  // console.log("this is singleBot pack number", singleBot.PackNumber);

  // console.log("this is the packName in connectXDCC", packName);
  // console.log("this is the packNumber in connectXDCC", packNumber);

  var ProgressBar = require('progress');

  var irc = require('xdcc').irc;
  var path;

  if(isDevelopment) {
    path = 'F:\anime';
  }

  else {
    // path = process.cwd();
    // path = require('path').basename(__dirname);
    path = 'F:\anime';
  }

  // path = __dirname;


  console.log("this is the path", path);

  // var normalPath = '.'
  // var hostUser = 'NIBL|Arutha';
  // var pack = 5252;


  var user = 'desu' + Math.random().toString(36).substr(7, 3);

  var hostUser = singleBot.BotToUse;
  var pack = singleBot.PackNumber;
  var channelToJoin = '#' + singleBot.ChannelToJoin;
  var progress;


  var client = new irc.Client('irc.rizon.net', user, {
    channels: [channelToJoin],
    userName: user,
    realName: user,
    debug: false
  });

  // just call client.getXdcc without putting it in the client.on('join')
  // connect in another function, then do whatever
  // get rid of the client.on join socket then?
  // move client.on join into the connectXDCC method
  // need to pass the client as a param or make it global

  // client.getXdcc(hostUser, 'xdcc send #' + pack, path);

  client.on('join', function(channel, nick, message) {
    if (nick !== user) return;
    console.log('Joined', channel);
    client.getXdcc(hostUser, 'xdcc send #' + pack, path);
  });

  client.on('xdcc-connect', function(meta) {
    console.log('Connected: ' + meta.ip + ':' + meta.port);
    progress = new ProgressBar('Downloading... [:bar] :percent, :etas remaining', {
      incomplete: ' ',
      total: meta.length,
      width: 20
    });
    // console.log("this is the progressBar", progress);
  });

  var last = 0;
  client.on('xdcc-data', function(received, details) {

    // console.log("this is deatails", details);
    // console.log("this is details length", details.length);
    // console.log("this is percent received", percent);

    var percent = (received/details.length)*100

    var dataProgress = {
      fileName: details.file,
      percent: percent
    }
    // how to send this information to ipcRenderer
    // probably need to make this an object with the title so it can find the file

    // maybe rate limit this call
    downloadingWindow.webContents.send('connect:XDCC', dataProgress);
    //
    progress.tick(received - last);
    last = received;
  });

  client.on('xdcc-end', function(received) {
    console.log('Download completed');
    // disconnect from server here
    callback(null, 1);
    client.disconnect('disconnecting from server', () => {
      console.log('disconnecting!!!');
    });
  });

  client.on('notice', function(from, to, message) {
    if (to == user && from == hostUser) {
      console.log("[notice]", message);
    }
  });

  client.on('error', function(message) {
    console.error(message);
  });

  client.addListener('message', function (from, to, message) {
      console.log(from + ' => ' + to + ': ' + message);
  });
}


ipcMain.on('folder:open', (event, outputPath) => {
  shell.showItemInFolder(outputPath);
});
