function applyExtraSetup(sequelize) {
  const {
    assessment,
    folder,
    uploader,
    uploaderGroup,
    uploadRequest,
    user,
    video,
  } = sequelize.models;

  user.hasMany(folder, { foreignKey: "ownerId" });
  folder.belongsTo(user, { foreignKey: "ownerId" });

  folder.hasMany(folder, { foreignKey: "parentId", as: "childFolders" });
  folder.belongsTo(folder, { foreignKey: "parentId", as: "parentFolder" });

  folder.hasMany(uploaderGroup, { foreignKey: "folderId" });
  uploaderGroup.belongsTo(folder, { foreignKey: "folderId" });

  folder.hasMany(assessment, { foreignKey: "folderId" });
  assessment.belongsTo(folder, { foreignKey: "folderId" });
  //TODO: add constraint so (name, parentId) is unique across file types

  assessment.belongsToMany(uploaderGroup, { through: "AssessmentGroups" });
  uploaderGroup.belongsToMany(assessment, { through: "AssessmentGroups" });

  uploaderGroup.belongsToMany(uploader, { through: "UploaderGroupMembers" });
  uploader.belongsToMany(uploaderGroup, { through: "UploaderGroupMembers" });

  assessment.belongsToMany(uploader, { through: "AssessmentUploaders" });
  uploader.belongsToMany(assessment, { through: "AssessmentUploaders" });

  uploader.hasMany(uploadRequest, { foreignKey: "uploaderId" });
  uploadRequest.belongsTo(uploader, { foreignKey: "uploaderId" });

  assessment.hasMany(uploadRequest, { foreignKey: "assessmentId" });
  uploadRequest.belongsTo(assessment, { foreignKey: "assessmentId" });

  uploader.hasMany(video, { foreignKey: "uploaderId" });
  video.belongsTo(uploader, { foreignKey: "uploaderId" });

  assessment.hasMany(video, { foreignKey: "assessmentId" });
  video.belongsTo(assessment, { foreignKey: "assessmentId" });
}

module.exports = { applyExtraSetup };
