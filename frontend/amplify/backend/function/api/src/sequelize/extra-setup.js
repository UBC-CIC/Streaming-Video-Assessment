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
    return await Promise.all([
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

  uploader.prototype.canUploadTo = async function (assessmentId) {
    if (await this.hasAssessment(assessmentId)) return true;

    const countUploaderGroupsOnAssessmentWhereUploaderIsMember =
      await this.countUploaderGroups({
        include: [
          { model: sequelize.models.assessment, where: { id: assessmentId } },
        ],
      });

    return countUploaderGroupsOnAssessmentWhereUploaderIsMember > 0;
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

  folder.prototype.move = async function (newParentId) {
    const newParent = await folder.findByPk(newParentId);

    if (newParent.ownerId !== this.ownerId) {
      throw new Error("You can only move folders to folders owned by you");
    }

    return await this.update({ parentId: newParentId });
  };

  assessment.prototype.move = async function (newFolderId) {
    if (this.folderId === newFolderId) return;

    // TODO: check that newFolder isnt a distant parent of this.

    const folders = await folder.findAll({
      where: { id: [this.folderId, newFolderId] },
    });

    if (folders.length < 2) {
      throw new Error("One or both of the folders does not exist");
    }

    console.log(folders);

    if (folders[0].ownerId !== folders[1].ownerId) {
      throw new Error("You can only move assessments to folders owned by you");
    }

    return this.update({ folderId: newFolderId });
  };

  uploaderGroup.prototype.move = async function (newFolderId) {
    if (this.folderId === newFolderId) return;

    const folders = await folder.findAll({
      where: { id: [this.folderId, newFolderId] },
    });

    if (folders.length < 2) {
      throw new Error("One or both of the folders does not exist");
    }

    if (folders[0].ownerId !== folders[1].ownerId) {
      throw new Error(
        "You can only move Uploader Groups to folders owned by you",
      );
    }

    return this.update({ folderId: newFolderId });
  };

  uploadRequest.prototype.getVideo = async function () {
    return await video.findOne({
      where: { uploaderId: this.uploaderId, assessmentId: this.assessmentId },
    });
  };

  assessment.prototype.removeUploadersAndGroups = async function (
    removeUploaders,
    removeGroups,
  ) {
    const currentUploaders = await this.getUploaders();
    const currentGroups = await this.getUploaderGroups();

    const uploadersToRemove = currentUploaders.filter((uploader) => {
      return removeUploaders.find(
        (sharedUploader) => sharedUploader.email === uploader.email,
      );
    });

    const groupsToRemove = currentGroups.filter((group) => {
      return removeGroups.find((sharedGroup) => sharedGroup.id === group.id);
    });

    await this.removeUploaders(uploadersToRemove);
    await this.removeUploaderGroups(groupsToRemove);
  };

  assessment.prototype.getOwner = async function () {
    const folder = await this.getFolder({
      include: [
        {
          association: "owner",
        },
      ],
    });
    return folder.owner;
  };

  uploaderGroup.prototype.getOwner = async function () {
    const folder = await this.getFolder({
      include: [
        {
          association: "owner",
        },
      ],
    });
    return folder.owner;
  };
}

module.exports = { applyExtraSetup };
