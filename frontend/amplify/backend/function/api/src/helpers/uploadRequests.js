const sequelize = require("../sequelize");
const { sendUploadRequestEmail } = require("./sendEmail");

// Will create all upload requests for all users and groups on the assignment
async function createUploadRequestsForAssessment(
  assessment,
  host = '',
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
      createUploadRequestForUser(assessment, uploader, host),
    ),
  );
}

async function createUploadRequestsForNewUploaders(
  assessment,
  newUploaders,
  newGroups,
  host = '',
) {
  const uploaders = [...newUploaders];

  uploaders.push(
    ...newGroups.map((uploaderGroup) => uploaderGroup.uploaders).flat(),
  );

  // remove duplicates by id
  const uniqueUploaders = uploaders.filter(
    (uploader, index, self) =>
      index === self.findIndex((t) => t.id === uploader.id),
  );

  console.log("uniqueUploaders", uniqueUploaders);

  return await Promise.all(
    uniqueUploaders.map(async (uploader) => {
      createUploadRequestForUser(assessment, uploader, host);
    }),
  );
}

async function createUploadRequestForUser(
  assessment,
  user,
  host = '',
) {
  const [uploadRequest, _] = await sequelize.models.uploadRequest.findOrCreate({
    where: { uploaderId: user.id, assessmentId: assessment.id },
  });

  if (host) sendUploadRequestEmail(user, assessment, uploadRequest, host);

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
  createUploadRequestsForNewUploaders,
  createUploadRequestForUser,
  getUploadRequest,
};
