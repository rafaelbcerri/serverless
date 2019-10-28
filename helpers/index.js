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

module.exports = {
  splitArrayIntoBatches,
  buildResponse
}