const sequelize = require("../sequelize");

// Will create all upload requests for all users and groups on the assignment
async function createUploadRequestsForAssessment(
  assessment,
  sendEmail = false,
  updating = false,
) {
  const uploaderGroups = await assessment.getUploaderGroups({
    include: [sequelize.models.uploader],
  });

  const uploaders = await assessment.getUploaders();

  uploaders.push(
    ...uploaderGroups.map((uploaderGroup) => uploaderGroup.uploaders).flat(),
  );

  // remove duplicates by id
  const uniqueUploaders = uploaders.filter(
    (uploader, index, self) =>
      index === self.findIndex((t) => t.id === uploader.id),
  );

  return await Promise.all(
    uniqueUploaders.map(async (uploader) => {
      if (updating && (await sendUploadRequestEmail(assessment, uploader)))
        return;
      createUploadRequestForUser(assessment, uploader, sendEmail);
    }),
  );
}

async function sendUploadRequestEmail(assessment, uploader) {
  const hasRequest = await uploader.getUploadRequests({
    where: {
      assessmentId: assessment.id,
    },
  });

  return hasRequest.length > 0;
}

async function createUploadRequestForUser(assessment, user, sendEmail = false) {
  // TODO: add email sending
  const uploadRequest = await sequelize.models.uploadRequest.create({
    uploaderId: user.id,
    assessmentId: assessment.id,
  });

  const url = `http://localhost:5173/submit/${assessment.id}?secret=${uploadRequest.id}`;

  console.log(`*** Created upload url for ${user.name} at ${url}`);

  return uploadRequest;
}

async function getUploadRequest(pk, assessmentId) {
  const uploadRequest = await sequelize.models.uploadRequest.findByPk(pk, {
    where: {
      assessmentId,
    },
    include: [sequelize.models.uploader, sequelize.models.assessment],
  });

  if (!uploadRequest) return;

  if (await uploadRequest.uploader.canUploadTo(assessmentId))
    return uploadRequest;

  return;
}

module.exports = {
  createUploadRequestsForAssessment,
  createUploadRequestForUser,
  getUploadRequest,
};
