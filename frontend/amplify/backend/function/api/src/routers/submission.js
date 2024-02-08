const express = require("express");
const router = express.Router();

const {
  initializeUpload,
  getUploadUrl,
  getUrlForKey,
  completeUpload,
} = require("../helpers/s3");

// Define your routes here
// router.get("/:submissionId", (req, res) => {
//   res.json({ success: "get call succeed!", url: req.url });
// });

// router.post("/", (req, res) => {
//   res.json({ success: "post call succeed!", url: req.url, body: req.body });
// });

router.post("/init-upload", async (req, res) => {
  const assignmentId = req.body["assignmentId"];
  const secret = req.body["secret"];
  const key = `public/${assignmentId}/${secret}.webm`;

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
  const assignmentId = req.body["assignmentId"];
  const secret = req.body["secret"];
  const uploadId = req.body["uploadId"];
  const partNumber = req.body["partNumber"];
  const key = `public/${assignmentId}/${secret}.webm`;
  console.log("NEXT UPLOAD URL", key, req.body);

  const signedUrl = await getUploadUrl(key, uploadId, partNumber);

  res.json({
    signedUrl,
    partNumber,
  });
});

router.post("/complete-upload", async (req, res) => {
  const assignmentId = req.body["assignmentId"];
  const secret = req.body["secret"];
  const uploadId = req.body["uploadId"];
  const parts = req.body["parts"];

  console.log("COMPLETE UPLOAD", req.body);
  const key = `public/${assignmentId}/${secret}.webm`;

  await completeUpload(key, uploadId, parts);

  res.json({ signedUrl: await getUrlForKey(key) });
});

router.put("/:submissionId", (req, res) => {
  res.json({ success: "put call succeed!", url: req.url, body: req.body });
});

router.delete("/:submissionId", (req, res) => {
  res.json({ success: "delete call succeed!", url: req.url });
});

// Export the router
module.exports = router;
