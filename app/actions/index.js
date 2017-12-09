import { ipcRenderer }  from 'electron';
import { FETCH_SUGGESTIONS, UPDATE_TEMP_QUEUE, DELETE_TEMP_QUEUE, SEND_TEMP_QUEUE, DOWNLOAD_TEMP_QUEUE } from "./types";
// const {BrowserWindow} = require('electron').remote;
// let downloadWindow = new BrowserWindow({ 
//     width: 1000, 
//     height: 800,
//     minWidth: 640,
//     minHeight: 480,
//     show: false ,
//     nativeWindowOpen: true
//   });

// import { requireTaskPool } from 'electron-remote';
// ipcRenderer.setMaxListeners(0);

// TODO: Communicate to MainWindow process that videos
// have been added and are pending conversion
export const addVideos = videos => dispatch => {
  // the ipcRenderer.send acts as a 'route' in node.js
  // you can do manipulation of data in the ipcRenderer
  ipcRenderer.send('videos:added', videos);
  ipcRenderer.on('metadata:complete',  (event, videosWithData) => {
    dispatch({
      type: ADD_VIDEOS,
      payload: videosWithData
    });
  });
};

export const fetchSuggestions = tempTitle => dispatch => {
  ipcRenderer.send('fetch:suggestions', tempTitle);
  ipcRenderer.once('fetch:suggestionsDone', (event, suggestions) => {
    dispatch({
      type: FETCH_SUGGESTIONS,
      payload: suggestions
    });
  });
};

export const updateTempQueue = (queue) => {
  return({
    type: UPDATE_TEMP_QUEUE,
    payload: queue
  });
}

export const deleteTempQueue = (item) => {
  return({
    type: DELETE_TEMP_QUEUE,
    payload: item
  });
}

export const sendTempQueue = queue => dispatch => {
  ipcRenderer.send('send:queue', queue);
  ipcRenderer.once('send:queueDone', (event, botStack) => {
    dispatch({
      type: SEND_TEMP_QUEUE,
      payload: botStack
    });
  });
}

export const downloadWindowSend = (queue) => {
  return({
    type: DOWNLOAD_TEMP_QUEUE,
    payload: queue
  });
}

// TODO: Communicate to MainWindow that the user wants
// to start converting videos.  Also listen for feedback
// from the MainWindow regarding the current state of
// conversion.
export const convertVideos = videos => dispatch => {
  ipcRenderer.send('conversion:start', videos);

  ipcRenderer.on('conversion:end', (event, convertedVideo) => {
    var video = convertedVideo.video;
    var outputPath = convertedVideo.outputPath;
    dispatch({
      type: VIDEO_COMPLETE,
      payload: {...video, outputPath}
    });
  })

  ipcRenderer.on('conversion:progress', (event, progressVideo) => {
    var video = progressVideo.video;
    var timemark = progressVideo.timemark;
    dispatch({
      type: VIDEO_PROGRESS,
      payload: { ...video, timemark }
    });
  });
};