const aws = require('aws-sdk');

const splitArrayIntoBatches = (arr, limit = 7) => arr.reduce(
  (acc, item) => {
    if (acc.length && acc[acc.length - 1].length < limit) {
      acc[acc.length - 1].push(item);
      return acc;
    }
    return [...acc, [item]];
  },
  [],
);

const buildResponse = (body, statusCode = 200) => {
  return {
    "statusCode": statusCode,
    "headers": {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      "Content-Type": "application/json"
    },
    "isBase64Encoded": false,
    "body": JSON.stringify(body)
  }
}

const sendMessageBatch = (messages, queueUrl, batchSize = 1, delayTime = 60) => {
  let delay = 0;
  const messagesBatch = splitArrayIntoBatches(messages, batchSize);
  const sqs = new aws.SQS({
    apiVersion: '2012-11-05',
    region: process.env.AWS_REGION,
    endpoint: process.env.AWS_ENDPOINT_URL,
    sslEnabled: false
  });

  return Promise.all(messagesBatch.map(function (batch) {
    const message = createMessage(batch, delay, queueUrl);
    delay += delayTime;
    return sqs.sendMessage(message).promise();
  }))
    .then(results => results.reduce(
      (memo, item) => memo.concat(item),
      [],
    ));
}

const createMessage = (body, delay, queueUrl) => ({
  MessageBody: JSON.stringify(body),
  DelaySeconds: delay,
  QueueUrl: queueUrl
});

module.exports = {
  splitArrayIntoBatches,
  buildResponse,
  sendMessageBatch
}