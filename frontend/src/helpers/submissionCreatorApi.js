import { get, post, put } from "aws-amplify/api";

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
    console.error("GET call failed: ", error);
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
    console.error("POST call failed: ", error);
  }

  return null;
};

export const moveFile = async (file, newFolder) => {
  try {
    const restOperation = put({
      apiName: "backend",
      path: "/api/folder/move",
      options: {
        body: {
          file,
          newFolderId: newFolder.id,
        },
      },
    });
    const { body } = await restOperation.response;
    const response = await body.json();
    console.log("PUT call succeeded: ", response);
    return response.data;
  } catch (error) {
    console.error("PUT call failed: ", error);
  }

  return null;
};

export const createNewGroup = async (groupName, parentId, groupList) => {
  try {
    const restOperation = post({
      apiName: "backend",
      path: "/api/group/",
      options: {
        body: {
          name: groupName,
          folderId: parentId,
          users: groupList,
        },
      },
    });
    const { body } = await restOperation.response;
    const response = await body.json();
    console.log("POST call succeeded: ", response);
    return response;
  } catch (error) {
    console.error("POST call failed: ", error);
  }

  return null;
};

export const getGroupInfo = async (groupId) => {
  try {
    const restOperation = get({
      apiName: "backend",
      path: "/api/group/" + groupId,
    });
    const { body } = await restOperation.response;
    const response = await body.json();
    console.log("GET call succeeded: ", response);
    return response.data;
  } catch (error) {
    console.error("GET call failed: ", error);
  }
};

export const getSubmissionData = async (submissionId) => {
  try {
    const restOperation = get({
      apiName: "backend",
      path: "/api/assessment/" + submissionId,
    });
    const { body } = await restOperation.response;
    const response = await body.json();
    console.log("GET call succeeded: ", response);
    return response.data;
  } catch (error) {
    console.error("GET call failed: ", error);
  }
};

export const createAssessment = async (assessmentData) => {
  try {
    const restOperation = post({
      apiName: "backend",
      path: "/api/assessment/",
      options: {
        body: assessmentData,
      },
    });
    const { body } = await restOperation.response;
    const response = await body.json();
    console.log("POST call succeeded: ", response);
    return response;
  } catch (error) {
    console.error("POST call failed: ", error);
  }

  return null;
};
