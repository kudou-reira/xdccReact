const axios = require('axios');

function fetchSuggestions(suggestion) {
  console.log("this is the suggestion", suggestion);
  // can always try using request module for node
  fetchSuggestions(suggestion)
    .then((data) => {
      console.log('this is the returned data', data);
      return data;
    });
}

async function fetchSuggestions(suggestion) {
  const res = await axios.get('http://localhost:8080/xdccTempSearch', {
    params: {
      suggestion
    }
  });
  return res.data;
}

module.exports = fetchSuggestions;