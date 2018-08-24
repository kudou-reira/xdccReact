const axios = require('axios');

function fetchAnime(season, year, xdccAnilist) {
  fetchAnime(season, year, xdccAnilist)
    .then((data) => {
      console.log('this is the returned data in fetchAnime', data);
      return data;
    });
}

async function fetchAnime(season, year, xdccAnilist) {
  const res = await axios.get(xdccAnilist, {
    params: {
      season,
      year
    }
  });
  return res.data;
}

module.exports = fetchAnime;