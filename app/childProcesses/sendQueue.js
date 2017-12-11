const axios = require('axios');

function sendQueue(queue, xdccBotSearch) {
  console.log("this is the queue", queue);
  sendQueue(queue, xdccBotSearch)
    .then((data) => {
      console.log('this is the returned data', data);
      return data;
    });
}

async function sendQueue(queue, xdccBotSearch) {
  const res = await axios.get(xdccBotSearch, {
    params: {
      queue
    }
  });
  console.log("this is res in tempqueue", res);
  return res.data;
}

module.exports = sendQueue;