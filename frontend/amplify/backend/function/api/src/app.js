/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

const express = require("express");
const bodyParser = require("body-parser");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");

// router import
const folderRouter = require("./routers/folder");
const groupRouter = require("./routers/group");
const assessmentRouter = require("./routers/assessment");
const submissionRouter = require("./routers/submission");

const region = "ca-central-1";
const userPoolId = "ca-central-1_RGMoyaPVY";
const clientId = "2q1vlf8f8vkl965un3pists4bo";

const jwksUrl = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
var jwt = require('jsonwebtoken');
var jwksClient = require('jwks-rsa');
var client = jwksClient({
  jwksUri: jwksUrl
});
function getKey(header, callback) {
  client.getSigningKey(header.kid, function(err, key) {
    var signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}
// declare a new express app
const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function (req, res, next) {
  // CORS will force the browser to send pre-flight every time
  // pre-flight doesn't have authorization header so it'll get flagged without fail
  if(req.method === "OPTIONS"){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    return res.status(200).send();
  }
  next();
});
app.use(async function (req, res, next){
  // console.log("method: ", req.method);
  const claim = req.headers.authorization;
  // console.log("claim: ", claim);
  jwt.verify(
    claim,
    getKey,
    {
      algorithms: ["RS256"],
      token_use: "id",
      issuer: `https://cognito-idp.${region}.amazonaws.coom/${userPoolId}`,
      audience: clientId,
    },
    function (err, decodedToken) {
      if (err) {
        console.error(err);
        return res.status(401).send("Unauthorized");
      }
      console.log("decodedToken: ", decodedToken);
      req["userEmail"] = decodedToken.email;
      // console.log("userEmail: ", req["userEmail"]);
      next();
    },
  );
});
app.use("/api/folder", folderRouter);
app.use("/api/group", groupRouter);
app.use("/api/assessment", assessmentRouter);
app.use("/api/submission", submissionRouter);

app.get("/api/ping", function (req, res) {
  res.send("pong");
});

app.listen(3000, function () {
  console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
