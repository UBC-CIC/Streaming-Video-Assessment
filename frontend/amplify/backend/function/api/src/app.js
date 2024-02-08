/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/
import awsServerlessExpressMiddleware from "aws-serverless-express/middleware.js";
import bodyParser from "body-parser";
import express from "express";

// router import
import assessmentRouter from "./routers/assessment.js";
import folderRouter from "./routers/folder.js";
import groupRouter from "./routers/group.js";
import submissionRouter from "./routers/submission.js";

// declare a new express app
const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

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
export default app;
