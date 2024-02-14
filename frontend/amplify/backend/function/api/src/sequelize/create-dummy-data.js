// If you want to start from scratch, you can run the following command in SQL to delete all tables and data in the database:
// DROP DATABASE dropzone;
// CREATE DATABASE dropzone;
//
// Sequelize will recreate the tables, and this will populate it with some dummy data.

const sequelize = require(".");

const { user, folder } = sequelize.models;

async function create() {
  const user1 = await user.create(
    {
      email: "hmitgang+4@student.ubc.ca",
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

  //   const user1 = await user.findByPk(1);
  const root = await user1.getRoot();

  const spanish1 = await folder.create({
    name: "Spanish 1",
    ownerId: user1.id,
    parentId: root.id,
  });

  const spanish2 = await folder.create({
    name: "Spanish 2",
    ownerId: user1.id,
    parentId: root.id,
  });

  const spanish1tests = await folder.create({
    name: "Tests",
    ownerId: user1.id,
    parentId: spanish1.id,
  });

  const rootChildrenFolders = await root.getChildFolders({
    include: [{ model: folder, as: "childFolders" }],
  });
}

sequelize.sync().then(create);
