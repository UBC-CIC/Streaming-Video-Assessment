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

  user.prototype.getRoot = async function () {
    const root = await this.getFolders({ where: { parentId: null } });

    return root.at(0);
  };

  folder.prototype.getContents = async function () {
    return await Promise.allSettled([
      this.getUploaderGroups().then((groups) =>
        groups.map((g) => ({ ...g.dataValues, type: "group" })),
      ),
      this.getAssessments().then((assessments) =>
        assessments.map((a) => ({ ...a.dataValues, type: "assessment" })),
      ),
      this.getChildFolders().then((folders) =>
        folders.map((f) => ({ ...f.dataValues, type: "folder" })),
      ),
    ]);
  };

  folder.prototype.getFolderPath = async function () {
    const path = [];
    let currentFolder = this;
    while (currentFolder) {
      path.unshift({ name: currentFolder.name, id: currentFolder.id });
      currentFolder = await currentFolder.getParentFolder();
    }
    return path;
  };
}

module.exports = { applyExtraSetup };
