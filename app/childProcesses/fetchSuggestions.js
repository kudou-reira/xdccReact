const axios = require('axios');

function fetchSuggestions(suggestion, xdccTempSearch) {
  console.log("this is the suggestion", suggestion);
  fetchSuggestions(suggestion, xdccTempSearch)
    .then((data) => {
      console.log('this is the returned data', data);
      return data;
    });
}

async function fetchSuggestions(suggestion, xdccTempSearch) {
  const res = await axios.get(xdccTempSearch, {
    params: {
      suggestion
    }
  });
  return res.data;
}

module.exports = fetchSuggestions;