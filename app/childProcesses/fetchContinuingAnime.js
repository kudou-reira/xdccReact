const axios = require('axios');

function fetchContinuingAnime(season, year, xdccAnilist) {
  fetchContinuingAnime(season, year, xdccAnilist)
    .then((data) => {
      console.log('this is the returned data in fetchAnime', data);
      return data;
    });
}

async function fetchContinuingAnime(season, year, xdccAnilist) {
  const res = await axios.get(xdccAnilist, {
    params: {
      season,
      year
    }
  });
  return res.data;
}

module.exports = fetchContinuingAnime;