const express = require("express");
const router = express.Router();
const sequelize = require("../sequelize");
const { assessment, uploader } = sequelize.models;
const {
  createUploadRequestsForAssessment,
} = require("../helpers/uploadRequests");

// Define your routes here
router.get("/:assessmentId", async (req, res) => {
  const query = await assessment.findByPk(req.params.assessmentId);
  query.dataValues.submissions = await query.getSubmissions();
  res.json({ success: "get call succeed!", data: query });
});

router.post("/", async (req, res) => {
  /**
   * 
   * {
      folderId: 1,
      name: 'Test',
      description: 'Tes',
      timeLimitSeconds: 3660,
      faceBlurAllowed: true,
      dueDate: '2024-02-08T11:49',
      sharedUploaders: [],
      sharedGroups: []
    }
   */

  // create assessment
  const newAssessment = await assessment.create({
    name: req.body.name,
    description: req.body.description,
    timeLimitSeconds: req.body.timeLimitSeconds,
    faceBlurAllowed: req.body.faceBlurAllowed,
    dueDate: req.body.dueDate,
    folderId: req.body.folderId,
  });

  // add uploader and groups to assessment
  for (let sharedUploader of req.body.sharedUploaders) {
    const [user, _] = await uploader.findOrCreate({
      where: { email: sharedUploader.email },
      defaults: {
        name: sharedUploader.name,
      },
    });

    newAssessment.addUploader(user);
  }

  req.body.sharedGroups.forEach((group) => {
    newAssessment.addUploaderGroup(group);
  });

  await createUploadRequestsForAssessment(newAssessment, true);

  res.json({ success: "post call succeed!", url: req.url, body: req.body });
});

router.put("/:assessmentId", (req, res) => {
  res.json({ success: "put call succeed!", url: req.url, body: req.body });
});

router.delete("/:assessmentId", (req, res) => {
  res.json({ success: "delete call succeed!", url: req.url });
});

// Export the router
module.exports = router;
