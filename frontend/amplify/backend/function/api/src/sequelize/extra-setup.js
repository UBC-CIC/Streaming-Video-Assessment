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

  user.folders = user.hasMany(folder, { foreignKey: "ownerId", as: "folders" });
  folder.user = folder.belongsTo(user, { foreignKey: "ownerId", as: "owner" });

  folder.childFolders = folder.hasMany(folder, {
    foreignKey: "parentId",
    as: "childFolders",
  });

  folder.belongsTo(folder, {
    foreignKey: "parentId",
    as: "parentFolder",
  });

  folder.hasMany(uploaderGroup, { foreignKey: "folderId" });
  uploaderGroup.belongsTo(folder, { foreignKey: "folderId" });

  folder.hasMany(assessment, { foreignKey: "folderId" });
  assessment.belongsTo(folder, { foreignKey: "folderId" });
  //TODO: add constraint so (name, parentId) is unique across file types

  assessment.belongsToMany(uploaderGroup, { through: "assessmentGroups" });
  uploaderGroup.belongsToMany(assessment, { through: "assessmentGroups" });

  uploaderGroup.belongsToMany(uploader, { through: "uploaderGroupMembers" });
  uploader.belongsToMany(uploaderGroup, { through: "uploaderGroupMembers" });

  assessment.belongsToMany(uploader, { through: "assessmentUploaders" });
  uploader.belongsToMany(assessment, { through: "assessmentUploaders" });

  uploader.hasMany(uploadRequest, { foreignKey: "uploaderId" });
  uploadRequest.belongsTo(uploader, { foreignKey: "uploaderId" });

  assessment.hasMany(uploadRequest, { foreignKey: "assessmentId" });
  uploadRequest.belongsTo(assessment, { foreignKey: "assessmentId" });

  uploader.hasMany(video, { foreignKey: "uploaderId" });
  video.belongsTo(uploader, { foreignKey: "uploaderId" });

  assessment.hasMany(video, { foreignKey: "assessmentId" });
  video.belongsTo(assessment, { foreignKey: "assessmentId" });

  user.prototype.getRoot = async function () {
    const root = await this.getFolders({ where: { parentId: null } });

    return root.at(0);
  };

  folder.prototype.getContents = async function () {
    return await Promise.allSettled([
      this.getUploaderGroups().then((groups) =>
        groups.map((g) => ({ ...g, type: "group" })),
      ),
      this.getAssessments().then((assessments) =>
        assessments.map((a) => ({ ...a, type: "assessment" })),
      ),
      this.getChildFolders().then((folders) =>
        folders.map((f) => ({ ...f, type: "folder" })),
      ),
    ]);
  };
}

module.exports = { applyExtraSetup };
