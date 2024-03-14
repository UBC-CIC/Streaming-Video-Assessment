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

// user auth import
const {CognitoJwtVerifier} = require('aws-jwt-verify');

const verifier = CognitoJwtVerifier.create({
  userPoolId: 'ca-central-1_RGMoyaPVY',
  tokenUse: 'access',
});

// declare a new express app
const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());
app.use(async function (req, res, next){
  console.log("headers: ", req.headers);
  console.log("authorization header: ", req.headers.authorization);
  try{const token = req.headers.authorization?.split(' ')[1];
  if(!token) return res.status(401).json({message: "Unauthorized"});

  const payload = await verifier.verify(token);
  console.log('Token is valid. JWT payload: ', payload);

  req["userEmail"] = payload.email;
  next();} catch(err){
    console.log(err);
    res.status(401).json({message: "Unauthorized: Invalid token"});
  }
});

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
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
