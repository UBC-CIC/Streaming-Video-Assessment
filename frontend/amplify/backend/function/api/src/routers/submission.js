const express = require("express");
const router = express.Router();

const {
  initializeUpload,
  getUploadUrl,
  getUrlForKey,
  completeUpload,
} = require("../helpers/s3");

const { s3BucketFolderName } = require("../config");

const { getUploadRequest } = require("../helpers/uploadRequests");
const sequelizePromise = require("../sequelize");

const submissionRouterPromise = new Promise((resolve, reject) => {
  sequelizePromise.then((sequelize) => {
    // Define your routes here
    router.get("/assessment-info/:assessmentId", async (req, res) => {
      const assessmentId = parseInt(req.params["assessmentId"]);
      const secret = req.query["secret"];

      const uploadRequest = await getUploadRequest(secret, assessmentId);

      if (!uploadRequest) {
        res.status(404).send("Not found");
        return;
      }

      if (uploadRequest.assessment.closed) {
        return res.json({
          id: assessmentId,
          name: uploadRequest.assessment.name,
          closed: true,
        });
      }

      const videoUpload = await uploadRequest.getVideo();

      const completedOn = videoUpload?.submitted ? videoUpload.updatedAt : null;

      res.json({
        secret,
        id: assessmentId,
        name: uploadRequest.assessment.name,
        description: uploadRequest.assessment.description,
        dueDate: uploadRequest.assessment.dueDate,
        timeLimitSeconds: uploadRequest.assessment.timeLimitSeconds,
        allowFaceBlur: uploadRequest.assessment.faceBlurAllowed,
        completedOn,
      });
    });

    // router.post("/", (req, res) => {
    //   res.json({ success: "post call succeed!", url: req.url, body: req.body });
    // });

    router.post("/init-upload", async (req, res) => {
      const assessmentId = parseInt(req.body["assessmentId"]);
      const secret = req.body["secret"];
      const key = `${s3BucketFolderName}/${assessmentId}/${secret}.webm`;

      const uploadRequest = await getUploadRequest(secret, assessmentId);
      if (!uploadRequest) {
        res.status(401).send("Unauthorized");
        return;
      }

      console.log("INIT UPLOAD", key, req.body);

      const uploadId = await initializeUpload(key);
      const signedUrl = await getUploadUrl(key, uploadId, 1);

      res.json({
        uploadId,
        signedUrl,
        partNumber: 1,
      });
    });

    router.post("/next-upload-url", async (req, res) => {
      const assessmentId = parseInt(req.body["assessmentId"]);
      const secret = req.body["secret"];
      const uploadId = req.body["uploadId"];
      const partNumber = req.body["partNumber"];
      const key = `${s3BucketFolderName}/${assessmentId}/${secret}.webm`;
      console.log("NEXT UPLOAD URL", key, req.body);

      const uploadRequest = await getUploadRequest(secret, assessmentId);
      if (!uploadRequest) {
        res.status(401).send("Unauthorized");
        return;
      }

      const signedUrl = await getUploadUrl(key, uploadId, partNumber);

      res.json({
        signedUrl,
        partNumber,
      });
    });

    router.post("/complete-upload", async (req, res) => {
      const assessmentId = parseInt(req.body["assessmentId"]);
      const secret = req.body["secret"];
      const uploadId = req.body["uploadId"];
      const parts = req.body["parts"];

      const uploadRequest = await getUploadRequest(secret, assessmentId);
      if (!uploadRequest) {
        res.status(401).send("Unauthorized");
        return;
      }

      console.log("COMPLETE UPLOAD", req.body);
      const key = `${s3BucketFolderName}/${assessmentId}/${secret}.webm`;

      const out = await completeUpload(key, uploadId, parts);

      await sequelize.models.video.create({
        s3Key: key,
        uploaderId: uploadRequest.uploaderId,
        assessmentId,
      });

      res.json({ signedUrl: await getUrlForKey(key) });
    });

    router.post("/submit", async (req, res) => {
      const assessmentId = parseInt(req.body["assessmentId"]);
      const secret = req.body["secret"];

      const uploadRequest = await getUploadRequest(secret, assessmentId);

      const video = await uploadRequest.getVideo();

      await video.update({ submitted: true });

      res.status(200).send();
    });

    resolve(router)
  }).catch((err) => {
    console.log(err)
    reject(err)
  })
})
// Export the router
module.exports = submissionRouterPromise;
