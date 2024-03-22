const sequelize = require("./index");

const { user, assessment, folder, uploaderGroup } = sequelize.models;

const { createDummyData, createUser } = require("./create-dummy-data");

describe("Sequelize", () => {
  beforeAll(async () => {
    await sequelize.sync();
  });

  it("should define all models", () => {
    const models = sequelize.models;
    expect(models).toHaveProperty("assessment");
    expect(models).toHaveProperty("folder");
    expect(models).toHaveProperty("uploader");
    expect(models).toHaveProperty("uploaderGroup");
    expect(models).toHaveProperty("uploadRequest");
    expect(models).toHaveProperty("user");
    expect(models).toHaveProperty("video");
  });

  describe("Folder", () => {
    beforeAll(async () => {
      const user1 = await createUser(sequelize, "testFolder@test.ca");
    });

    it("should be able to get root folder", async () => {
      const user1 = await createUser(
        sequelize,
        `test+${Math.random()}@test.ca`,
      );
      const root = await user1.getRoot();
      expect(await user1.getFolders()).toContainEqual(root);
    });

    it("isOwnedBy", async () => {
      const user1 = await user.findOne({
        where: { email: "testFolder@test.ca" },
      });
      const root = await user1.getRoot();

      const user2 = await createUser(sequelize, "notmine@test.ca");
      const notMineRoot = await user2.getRoot();

      expect(await folder.isOwnedBy(root.id, "testFolder@test.ca")).toBe(true);
      expect(await folder.isOwnedBy(notMineRoot.id, "testFolder@test.ca")).toBe(
        false,
      );
    });
  });

  describe("Assessments", () => {
    beforeAll(async () => {
      const user1 = await createUser(sequelize, `testAssessments@test.ca`);
    });

    it("getOwner should return the owner of the assessment", async () => {
      const user1 = await user.findOne({
        where: { email: "testAssessments@test.ca" },
      });

      const home = await user1.getRoot();

      const a = await assessment.create({
        name: "Test Assessment",
        description: "Test Description",
        timeLimitSeconds: 60,
        faceBlurAllowed: false,
        dueDate: new Date(),
        folderId: home.id,
      });

      expect((await a.getOwner()).dataValues).toEqual(user1.dataValues);
    });
  });

  describe("UploaderGroups", () => {
    beforeAll(async () => {
      const user1 = await createUser(sequelize, `testUploaderGroup@test.ca`);
    });

    it("getOwner should return the owner of the UploaderGroup", async () => {
      const user1 = await user.findOne({
        where: { email: "testUploaderGroup@test.ca" },
      });

      const home = await user1.getRoot();

      const g = await uploaderGroup.create({
        name: "Test UploaderGroup",
        folderId: home.id,
      });

      expect((await g.getOwner()).dataValues).toEqual(user1.dataValues);
    });
  });
});
