const axios = require('axios');

function sendQueue(queue) {
  console.log("this is the queue", queue);
  sendQueue(queue)
    .then((data) => {
      console.log('this is the returned data', data);
      return data;
    });
}

async function sendQueue(queue) {
  const res = await axios.get('http://localhost:8080/xdccBotSearch', {
    params: {
      queue
    }
  });
  console.log("this is res in tempqueue", res);
  return res.data;
}

module.exports = sendQueue;