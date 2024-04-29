// If you want to start from scratch, you can run the following command in SQL to delete all tables and data in the database:
// DROP DATABASE dropzone;
// CREATE DATABASE dropzone;
//
// Sequelize will recreate the tables, and this will populate it with some dummy data.
import { s3BucketFolderName } from "../config";

const {
  createUploadRequestsForAssessment,
} = require("../helpers/uploadRequests");

module.exports.createDummyData = async function (sequelize) {
  const { user, folder, uploaderGroup, uploader, assessment, video } =
    sequelize.models;

  const user1 = await user.create(
    {
      email: "hmitgang@student.ubc.ca",
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

  const uploader2 = await uploader.create({
    email: "hmitgang+1@student.ubc.ca",
    name: "Harrison Not Mitgang",
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

  const spanish1test1 = await assessment.create({
    name: "Test 1",
    folderId: spanish1tests.id,
    dueDate: new Date("2024-04-05"),
    timeLimitSeconds: 60,
    faceBlurAllowed: true,
  });

  // add student group to test
  await spanish1test1.addUploaderGroup(spanish1students);

  await spanish1test1.addUploader(uploader1);
  await spanish1test1.addUploaderGroup(spanish1students);

  await spanish1students.addUploader(uploader2);
  await spanish1test1.removeUploader(uploader2);
  console.log(await uploader2.canUploadTo(spanish1test1.id));

  // Trigger upload requests
  console.log(await createUploadRequestsForAssessment(spanish1test1, 'localhost:3000'));

  const rootChildrenFolders = await root.getChildFolders({
    include: [{ model: folder, as: "childFolders" }],
  });

  const video1 = await video.create({
    s3Key: `${s3BucketFolderName}/abc/1.webm`,
    uploaderId: uploader1.id,
    assessmentId: spanish1test1.id,
  });
};

module.exports.createUser = async function (sequelize, email) {
  const { user } = sequelize.models;

  return await user.create(
    {
      email,
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
};
