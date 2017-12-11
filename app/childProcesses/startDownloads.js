const axios = require('axios');

function startDownloads(downloads, xdccOptimizeDL) {
  console.log("these are the downloads", downloads);
  startDownloads(downloads, xdccOptimizeDL)
    .then((data) => {
      console.log('this is the returned data', data);
      return data;
    });
}

async function startDownloads(downloads, xdccOptimizeDL) {
  const res = await axios.get(xdccOptimizeDL, {
    params: {
      downloads
    }
  });
  return res.data;
}

module.exports = startDownloads;