const axios = require('axios');

function sendQueue(queue) {
  console.log("this is the queue", queue);
  // can always try using request module for node
  sendStack(queue)
    .then((data) => {
      console.log('this is the returned data', data);
      return data;
    });
}

async function sendStack(queue) {
  const res = await axios.get('http://localhost:8080/xdccBotSearch', {
    params: {
      queue
    }
  });
  return res.data;
}

module.exports = sendQueue;