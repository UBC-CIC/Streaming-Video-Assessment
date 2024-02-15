import { get, post } from "aws-amplify/api";

export const getFolderData = async (folderId) => {
  try {
    const restOperation = get({
      apiName: "backend",
      path: "/api/folder/" + folderId,
    });
    const { body } = await restOperation.response;
    const response = await body.json();
    console.log("GET call succeeded: ", response);
    return response.data;
  } catch (error) {
    console.log("GET call failed: ", error);
  }

  return null;
};

export const createFolder = async (folderName, parentId, userId) => {
  try {
    const restOperation = post({
      apiName: "backend",
      path: "/api/folder/",
      options: {
        body: {
          name: folderName,
          parentId: parentId,
          ownerId: userId,
        },
      },
    });
    const { body } = await restOperation.response;
    const response = await body.json();
    console.log("POST call succeeded: ", response);
    return response.data;
  } catch (error) {
    console.log("POST call failed: ", error);
  }

  return null;
};

export const getGroupList = async (groupId) => {
  return [
    { name: "John Doe", email: "test@gmail.com" },
    { name: "Jane Doe", email: "test2@gmail.com" },
    { name: "Billy Joel", email: "test3@gmail.com" },
    { name: "Bob Smith", email: "test4@gmail.com" },
  ];
};

export const getSubmissionData = async (submissionId) => {
  // try {
  //   const restOperation = get({
  //     apiName: "backend",
  //     path: "/api/assessment/" + submissionId,
  //   });
  //   const { body } = await restOperation.response;
  //   const response = await body.json();
  //   console.log("GET call succeeded: ", response);
  //   return response.data;
  // } catch (error) {
  //   console.log("GET call failed: ", error);
  // }

  return {
    name: "Spanish 30 Final",
    id: "submissionSpanish30Final",
    dueDate: "2015-03-05 14:48",
    isOpen: true,
    timeLimitSeconds: 6600,
    description: "This is the final test for Spanish 30",
    allowFaceBlur: true,
    submissions: [
      {
        name: "Harrison Mitgang",
        email: "test@gmail.com",
        uploadedOn: "2015-03-05 14:48:34.69",
        s3ref: "s3ref1",
        submissionId: "xyz1",
      },
      {
        name: "Jane Doe",
        email: "test2@gmail.com",
        uploadedOn: "2015-03-05 14:48:34.69",
        s3ref: "s3ref2",
        submissionId: "xyz2",
      },
      {
        name: "Billy Joel",
        email: "test3@gmail.com",
        uploadedOn: "2015-03-05 14:48:34.69",
        s3ref: "s3ref3",
        submissionId: "xyz3",
      },
    ],
  };
};
