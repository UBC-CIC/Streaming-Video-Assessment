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
