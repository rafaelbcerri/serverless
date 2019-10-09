'use strict';

const AWS = require('aws-sdk');


const options = {
  apiVersion: '2012-11-05',
  region: 'us-east-2',
  endpoint: "http://sqs:9324",
  sslEnabled: false
};

const sqs = new AWS.SQS(options);
// const sqs = new AWS.SQS({ region: 'us-east-2' });

const AWS_ACCOUNT = '498563869806';
// const QUEUE_URL = `https://sqs.us-east-2.amazonaws.com/${AWS_ACCOUNT}/PopulateDaily`;
const QUEUE_URL = `http://sqs:9324/queue/PopulateDaily`;

module.exports.hello = (event, context, callback) => {
  let delay = 20;

  const items = [
    {message: 'Hi' },
    {message: 'Hello' },
    {message: 'Oi' },
    {message: 'Olá' },
    {message: 'Hola' },
    {message: 'Ciao' }
  ];



  items.forEach(item => {
    const params = {
      MessageBody: item.message,
      DelaySeconds: delay,
      QueueUrl: QUEUE_URL
    };

    delay += 20;

    sqs.sendMessage(params, function (err, data) {
      if (err) {
        console.log('error:', 'Fail Send Message' + err);

        const response = {
          statusCode: 500,
          body: JSON.stringify({
            message: 'ERROR'
          })
        };

        callback(null, response);
      } else {
        console.log('data:', data.MessageId, item.message);

        const response = {
          statusCode: 200,
          body: JSON.stringify({
            message: data.MessageId
          })
        };

        callback(null, response);
      }
    });
  });

};

module.exports.sqsHello = (event, context, callback) => {
  console.log('it was called');

  console.log(event);

  context.done(null, '');
};