const express = require("express");
const router = express.Router();
const sequelize = require("../sequelize");
const { assessment, uploader, uploaderGroup } = sequelize.models;
const {
  createUploadRequestsForAssessment,
  createUploadRequestsForNewUploaders,
} = require("../helpers/uploadRequests");

// Define your routes here
router.get("/:assessmentId", async (req, res) => {
  const query = await assessment.findByPk(parseInt(req.params.assessmentId));
  const videos = await query.getVideos({
    include: [uploader],
    where: { submitted: true },
  });

  const videoDetailsPromises = videos.map(async (video) => {
    const user = await video.getUploader();
    return {
      name: user.name,
      email: user.email,
      uploadedOn: video.updatedAt,
      s3ref: video.s3Key,
      submissionId: video.id,
    };
  });
  query.dataValues.submissions = await Promise.all(videoDetailsPromises);

  res.json({ success: "get call succeed!", data: query });
});

router.get("/shared/:assessmentId", async (req, res) => {
  const query = await assessment.findByPk(parseInt(req.params.assessmentId));

  const sharedUploaders = await query.getUploaders();
  const sharedGroups = await query.getUploaderGroups();

  res.json({
    success: "get call succeed!",
    data: { sharedGroups, sharedUploaders },
  });
});

router.post("/", async (req, res) => {
  // create assessment
  const newAssessment = await assessment.create({
    name: req.body.name,
    description: req.body.description,
    timeLimitSeconds: req.body.timeLimitSeconds,
    faceBlurAllowed: req.body.faceBlurAllowed,
    dueDate: req.body.dueDate,
    folderId: req.body.folderId,
  });

  await linkUploaderAndGroups(
    newAssessment,
    req.body.sharedUploaders,
    req.body.sharedGroups,
  );

  await createUploadRequestsForAssessment(newAssessment);

  res.json({
    success: "post call succeed!",
    body: newAssessment,
  });
});

router.put("/:assessmentId", async (req, res) => {
  const assessmentQuery = await assessment.findByPk(req.params.assessmentId);

  assessmentQuery.update({
    name: req.body.name,
    description: req.body.description,
    timeLimitSeconds: req.body.timeLimitSeconds,
    faceBlurAllowed: req.body.faceBlurAllowed,
    dueDate: req.body.dueDate,
  });

  const { newUploaders, newGroups } = await linkUploaderAndGroups(
    assessmentQuery,
    req.body.newSharedUploaders,
    req.body.newSharedGroups,
  );

  await createUploadRequestsForNewUploaders(
    assessmentQuery,
    newUploaders,
    newGroups,
  );

  await assessmentQuery.removeUploadersAndGroups(
    req.body.removeSharedUploaders,
    req.body.removeSharedGroups,
  );

  res.json({ success: "put call succeed!", body: assessmentQuery });
});

router.delete("/:assessmentId", (req, res) => {
  res.json({ success: "delete call succeed!", url: req.url });
});

async function linkUploaderAndGroups(assessmentQuery, uploaders, groups) {
  newUploaders = uploaders.map((uploaderObj) => {
    return uploader.findOrCreate({
      where: { email: uploaderObj.email },
      defaults: { name: uploaderObj.name },
    });
  });

  newUploaders = await Promise.all(newUploaders).then((uploaders) => {
    return uploaders.map((uploader) => uploader[0]);
  });

  await assessmentQuery.addUploaders(newUploaders);

  newGroups = groups.map((groupObj) => {
    return uploaderGroup.findByPk(groupObj.id, { include: [uploader] });
  });

  newGroups = await Promise.all(newGroups);

  await assessmentQuery.addUploaderGroups(newGroups);

  return { newUploaders, newGroups };
}

// Export the router
module.exports = router;
