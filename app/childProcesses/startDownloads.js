const axios = require('axios');

function startDownloads(downloads) {
  console.log("these are the downloads", downloads);
  startDownloads(downloads)
    .then((data) => {
      console.log('this is the returned data', data);
      return data;
    });
}

async function startDownloads(downloads) {
  const res = await axios.get('http://localhost:8080/xdccOptimizeDL', {
    params: {
      downloads
    }
  });
  return res.data;
}

module.exports = startDownloads;