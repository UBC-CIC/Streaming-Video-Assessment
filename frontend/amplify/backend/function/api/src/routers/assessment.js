const express = require("express");
const router = express.Router();
const sequelizePromise = require("../sequelize");
const {
  createUploadRequestsForAssessment,
  createUploadRequestsForNewUploaders,
} = require("../helpers/uploadRequests");

const { getUrlForKey } = require("../helpers/s3");

const assessmentRouterPromise = new Promise((resolve, reject) => {
  sequelizePromise.then((sequelize) => {
    const { assessment, uploader, uploaderGroup, folder, video } = sequelize.models;

    // Define your routes here
    router.get("/:assessmentId", async (req, res) => {
      const query = await assessment.findByPk(parseInt(req.params.assessmentId), {
        include: [folder],
      });

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
          submissionId: video.id,
        };
      });
      query.dataValues.submissions = await Promise.all(videoDetailsPromises);

      query.dataValues.folderPath = await query.folder.getFolderPath();

      res.json({ success: "get call succeed!", data: query });
    });

    router.get("/:assessmentId/video/:submissionId", async (req, res) => {
      const query = await video.findByPk(parseInt(req.params.submissionId), {
        include: [
          uploader,
          {
            model: assessment,
            where: { id: parseInt(req.params.assessmentId) },
          },
        ],
      });

      if (
        !query ||
        !(await folder.isOwnedBy(query.assessment.folderId, req["userEmail"]))
      ) {
        return res.status(403).json({ error: "Forbidden" });
      }

      if (!query.submitted) {
        return res.status(404).json({ error: "Not Found" });
      }

      const videoUrl = await getUrlForKey(query.s3Key);

      return res.json({
        success: "get call succeed!",
        data: {
          name: query.uploader.name,
          email: query.uploader.email,
          uploadedOn: query.updatedAt,
          videoUrl,
        },
      });
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

      const host = req.get("host"); // TODO: Maybe we can make this more secure

      await createUploadRequestsForAssessment(newAssessment, host);

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

        const host = req.get("host"); // TODO: Maybe we can make this more secure
        await createUploadRequestsForNewUploaders(
          assessmentQuery,
          newUploaders,
          newGroups,
          host
        );

        await assessmentQuery.removeUploadersAndGroups(
          req.body.removeSharedUploaders,
          req.body.removeSharedGroups,
        );
      }

      res.json({ success: "put call succeed!", body: assessmentQuery });
    });

    router.delete("/:assessmentId", async (req, res) => {
      const query = await assessment.findByPk(parseInt(req.params.assessmentId));

      if (!query || (await query.getOwner()).email !== req["userEmail"]) {
        return res.status(403).json({ error: "Forbidden" });
      }

      await query.destroy();

      res.json({ success: "delete call succeed!", url: req.url });
    });
    
    resolve(router)
  }).catch((err) => {
    console.log(err)
    reject(err)
  })
})


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
module.exports = assessmentRouterPromise;
