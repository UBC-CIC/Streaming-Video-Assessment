const sequelize = require("./index");

const { user, assessment, folder, uploaderGroup } = sequelize.models;

const createDummyData = require("./create-dummy-data");

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

  it("should be able to get root folder", async () => {
    const user1 = await user.create(
      {
        email: `test+${Math.random()}@test.ca`,
        isPlatformManager: true,
        isAssessmentCreator: true,
        folders: [
          // Create root folder along with user
          {
            name: "Home",
          },
        ],
      },
      {
        include: [user.folders],
      },
    );

    const root = await user1.getRoot();

    expect(await user1.getFolders()).toContainEqual(root);
  });

  describe("Assessments", () => {
    beforeAll(async () => {
      const user1 = await user.create(
        {
          email: `testAssessments@test.ca`,
          isPlatformManager: true,
          isAssessmentCreator: true,
          folders: [
            // Create root folder along with user
            {
              name: "Home",
            },
          ],
        },
        {
          include: [user.folders],
        },
      );
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
      const user1 = await user.create(
        {
          email: `testUploaderGroup@test.ca`,
          isPlatformManager: true,
          isAssessmentCreator: true,
          folders: [
            // Create root folder along with user
            {
              name: "Home",
            },
          ],
        },
        {
          include: [user.folders],
        },
      );
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
