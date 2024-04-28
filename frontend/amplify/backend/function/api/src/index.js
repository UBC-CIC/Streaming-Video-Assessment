const awsServerlessExpress = require('aws-serverless-express');
const appPromise = require('./app');

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = (event, context) => {
  appPromise.then((app) => {
    /**
     * @type {import('http').Server}
     */
    const server = awsServerlessExpress.createServer(app);
    console.log(`EVENT: ${JSON.stringify(event)}`);
    return awsServerlessExpress.proxy(server, event, context, 'PROMISE').promise;
  }).catch((err) => {
    console.log(err)
  })
};