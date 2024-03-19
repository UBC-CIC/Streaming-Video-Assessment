const sequelize = require("./index");

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
    const { user } = sequelize.models;

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
});
