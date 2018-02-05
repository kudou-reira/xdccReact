import { ipcRenderer }  from 'electron';
import { 
  UPDATE_MESSAGE_QUEUE,
  DELETE_MESSAGE_QUEUE,
  CLEAR_MESSAGE_QUEUE,
  RENDERED_SEARCH,
  UPDATE_FORWARD_LIST,
  FETCH_ANIME,
  FETCH_CONTINUING_ANIME,
  FETCH_SUGGESTIONS, 
  UPDATE_TEMP_QUEUE, 
  DELETE_TEMP_QUEUE, 
  CLEAR_TEMP_QUEUE, 
  SEND_TEMP_QUEUE, 
  DOWNLOAD_TEMP_QUEUE, 
  REMOVE_DOWNLOAD, 
  CLEAR_DOWNLOAD,
  START_DOWNLOAD,
  DOWNLOADING_ITEMS,
  OPEN_SHELL,
  DEFAULT_SHELL
} from "./types";
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
ipcRenderer.setMaxListeners(0);

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

export const renderedSearch = (searchTitle) => {
  return({
    type: RENDERED_SEARCH,
    payload: searchTitle
  })
}

export const openShell = () => dispatch => {
  ipcRenderer.send('shell:open', 'open');
  ipcRenderer.once('shell:openDone', (event, path) => {
    dispatch({
      type: OPEN_SHELL,
      payload: path
    })
  });
}

export const defaultShell = () => dispatch => {
  ipcRenderer.send('shell:default', 'default');
  ipcRenderer.once('shell:defaultDone', (event, path) => {
    dispatch({
      type: DEFAULT_SHELL,
      payload: path
    })
  });
}

export const fetchAnime = (season, year) => dispatch => {
  ipcRenderer.send('fetch:anime', season, year);
  ipcRenderer.once('fetch:animeDone', (event, anime) => {
    dispatch({
      type: FETCH_ANIME,
      payload: anime
    });
  });
};

export const fetchContinuingAnime = (season, year) => dispatch => {
  ipcRenderer.send('fetch:continuingAnime', season, year);
  ipcRenderer.once('fetch:continuingAnimeDone', (event, anime) => {
    dispatch({
      type: FETCH_CONTINUING_ANIME,
      payload: anime
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

export const updateMessageQueue = (queue) => {
  return({
    type: UPDATE_MESSAGE_QUEUE,
    payload: queue
  });
}

export const deleteMessageQueue = (item) => {
  return({
    type: DELETE_MESSAGE_QUEUE,
    payload: item
  });
}

export const clearMessageQueue = () => {
  return({
    type: CLEAR_MESSAGE_QUEUE,
    payload: null
  });
}

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

export const clearTempQueue = () => {
  return({
    type: CLEAR_TEMP_QUEUE,
    payload: null
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

export const removeDownload = (item) => {
  return({
    type: REMOVE_DOWNLOAD,
    payload: item
  });
}

export const clearDownload = () => {
  return({
    type: CLEAR_DOWNLOAD,
    payload: []
  });
}

export const startDownloads = queue => dispatch => {
  ipcRenderer.send('start:downloads', queue);
  ipcRenderer.once('start:downloadsDone', (event, downloads) => {
    dispatch({
      type: START_DOWNLOAD,
      payload: downloads
    })
  })
}

export const downloadingItems = (queue) => {
  return({
    type: DOWNLOADING_ITEMS,
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