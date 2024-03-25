const express = require("express");
const router = express.Router();
const sequelize = require("../sequelize");
const { assessment, uploader, uploaderGroup, folder } = sequelize.models;
const {
  createUploadRequestsForAssessment,
  createUploadRequestsForNewUploaders,
} = require("../helpers/uploadRequests");

// Define your routes here
router.get("/:assessmentId", async (req, res) => {
  const query = await assessment.findByPk(parseInt(req.params.assessmentId));

  if (!query || (await query.getOwner()).email !== req["userEmail"]) {
    return res.status(403).json({ error: "Forbidden" });
  }

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

  if (!query || (await query.getOwner()).email !== req["userEmail"]) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const sharedUploaders = await query.getUploaders();
  const sharedGroups = await query.getUploaderGroups();

  res.json({
    success: "get call succeed!",
    data: { sharedGroups, sharedUploaders },
  });
});

router.post("/", async (req, res) => {
  const {
    folderId,
    name,
    description,
    timeLimitSeconds,
    faceBlurAllowed,
    dueDate,
    sharedUploaders,
    sharedGroups,
  } = req.body;

  if (!(await folder.isOwnedBy(parseInt(folderId), req["userEmail"]))) {
    return res.status(403).json({ error: "Forbidden" });
  }

  // TODO: make sure these fields are not blank
  // create assessment
  const newAssessment = await assessment.create({
    name,
    description,
    timeLimitSeconds,
    faceBlurAllowed,
    dueDate,
    folderId,
  });

  // TODO: make sure sharedUploaders and sharedGroups are in the correct format
  await linkUploaderAndGroups(newAssessment, sharedUploaders, sharedGroups);

  await createUploadRequestsForAssessment(newAssessment);

  res.json({
    success: "post call succeed!",
    body: newAssessment,
  });
});

router.put("/:assessmentId", async (req, res) => {
  // TODO: validate inputs
  const assessmentQuery = await assessment.findByPk(req.params.assessmentId);

  if (
    !assessmentQuery ||
    (await assessmentQuery.getOwner()).email !== req["userEmail"]
  ) {
    return res.status(403).json({ error: "Forbidden" });
  }

  // Define the allowed fields
  const allowedFields = [
    "name",
    "description",
    "timeLimitSeconds",
    "faceBlurAllowed",
    "dueDate",
    "faceBlurAllowed",
    "closedEarly",
  ];

  // Filter `req.body` to only contain allowed fields
  const filteredBody = Object.keys(req.body)
    .filter((key) => allowedFields.includes(key))
    .reduce((obj, key) => {
      obj[key] = req.body[key];
      return obj;
    }, {});

  assessmentQuery.update(filteredBody);

  if (req.body.hasUploaderChanges) {
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
  }

  res.json({ success: "put call succeed!", body: assessmentQuery });
});

router.delete("/:assessmentId", (req, res) => {
  // @aryang13 TODO: implement this and protect this endpoint
  res.json({ success: "delete call succeed!", url: req.url });
});

// @aryang13 TODO: move this to a helper file
async function linkUploaderAndGroups(assessmentQuery, uploaders, groups) {
  let newUploaders = uploaders.map((uploaderObj) => {
    return uploader.findOrCreate({
      where: { email: uploaderObj.email },
      defaults: { name: uploaderObj.name },
    });
  });

  newUploaders = await Promise.all(newUploaders).then((uploaders) => {
    return uploaders.map((uploader) => uploader[0]);
  });

  await assessmentQuery.addUploaders(newUploaders);

  let newGroups = groups.map((groupObj) => {
    return uploaderGroup.findByPk(groupObj.id, { include: [uploader] });
  });

  newGroups = await Promise.all(newGroups);

  await assessmentQuery.addUploaderGroups(newGroups);

  return { newUploaders, newGroups };
}

// Export the router
module.exports = router;
