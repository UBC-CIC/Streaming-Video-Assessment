export const getFolderData = async (folderId) => {
  // try {
  //   const restOperation = get({
  //     apiName: "backend",
  //     path: "/api/folder/" + folderId,
  //   });
  //   const { body } = await restOperation.response;
  //   const response = await body.json();
  //   console.log("GET call succeeded: ", response);
  // } catch (error) {
  //   console.log("GET call failed: ", error);
  // }

  return {
    path: [
      { name: "Home", id: "HOME" },
      { name: "2023", id: "xyz2023" },
      { name: "Tests", id: "xyz2023tests" },
    ],
    name: "Tests",
    id: "xyz2023tests",
    files: [
      {
        type: "group",
        name: "Spanish 30 Students",
        id: "groupSpanish30",
        dateCreated: "2015-01-01 14:48:34.69",
        dateModified: "2015-01-01 14:48:34.69",
      },
      {
        type: "folder",
        name: "Spanish 30",
        id: "folderSpanish30",
        dateCreated: "2015-02-01 14:48:34.69",
        dateModified: "2015-02-02 14:48:34.69",
      },
      {
        type: "folder",
        name: "Spanish 20",
        id: "folderSpanish20",
        dateCreated: "2015-01-01 14:48:34.69",
        dateModified: "2015-01-02 14:48:34.69",
      },
      {
        type: "submission",
        name: "Spanish 30 Final",
        id: "submissionSpanish30Final",
        dateCreated: "2015-03-01 14:48:34.69",
        dateModified: "2015-03-05 14:48:34.69",
      },
    ],
  };
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
  return {
    name: "Spanish 30 Final",
    id: "submissionSpanish30Final",
    dueDate: "2015-03-05 14:48:34.69",
    isOpen: true,
    timeLimitMinutes: 60,
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
