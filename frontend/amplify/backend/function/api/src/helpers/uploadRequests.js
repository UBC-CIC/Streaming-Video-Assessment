const sequelize = require("../sequelize");

// Will create all upload requests for all users and groups on the assignment
async function createUploadRequestsForAssessment(
  assessment,
  sendEmail = false,
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
    uniqueUploaders.map((uploader) =>
      createUploadRequestForUser(assessment, uploader, sendEmail),
    ),
  );
}

async function createUploadRequestForUser(assessment, user, sendEmail = false) {
  // TODO: add email sending
  return await sequelize.models.uploadRequest.create({
    uploaderId: user.id,
    assessmentId: assessment.id,
  });
}

module.exports = {
  createUploadRequestsForAssessment,
  createUploadRequestForUser,
};
