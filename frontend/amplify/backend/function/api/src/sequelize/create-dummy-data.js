// If you want to start from scratch, you can run the following command in SQL to delete all tables and data in the database:
// DROP DATABASE dropzone;
// CREATE DATABASE dropzone;
//
// Sequelize will recreate the tables, and this will populate it with some dummy data.

const sequelize = require(".");

const { user, folder, uploaderGroup, uploader } = sequelize.models;

async function create() {
  const user1 = await user.create(
    {
      email: "hmitgang+5@student.ubc.ca",
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

  const spanish1students = await uploaderGroup.create({
    name: "Students",
    folderId: spanish1.id,
  });

  const uploader1 = await uploader.create({
    email: "hmitgang@student.ubc.ca",
    name: "Harrison Mitgang",
  });

  await spanish1students.addUploader(uploader1);

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
