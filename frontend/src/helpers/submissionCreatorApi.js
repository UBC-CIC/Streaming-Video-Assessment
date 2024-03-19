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

export const getGroups = async (folderId) => {
  try {
    const path = folderId ? `/api/group?folderId=${folderId}` : "/api/group";
    const restOperation = get({
      apiName: "backend",
      path: path,
    });
    const { body } = await restOperation.response;
    const response = await body.json();
    console.log("GET call succeeded: ", response);
    return response.data;
  } catch (error) {
    console.error("GET call failed: ", error);
  }
};

export const getSharedWithList = async (assessmentId) => {
  try {
    const restOperation = get({
      apiName: "backend",
      path: `/api/assessment/shared/${assessmentId}`,
    });
    const { body } = await restOperation.response;
    const response = await body.json();
    console.log("GET call succeeded: ", response);
    return response.data;
  } catch (error) {
    console.error("GET call failed: ", error);
  }
};

export const editAssessment = async (assessmentId, assessmentData) => {
  try {
    const restOperation = put({
      apiName: "backend",
      path: `/api/assessment/${assessmentId}`,
      options: {
        body: assessmentData,
      },
    });
    const { body } = await restOperation.response;
    const response = await body.json();
    console.log("PUT call succeeded: ", response);
    return response;
  } catch (error) {
    console.error("PUT call failed: ", error);
  }

  return null;
};

export const editGroup = async (groupId, groupName, parentId, groupUsers) => {
  try {
    const restOperation = put({
      apiName: "backend",
      path: `/api/group/${groupId}`,
      options: {
        body: {
          name: groupName,
          folderId: parentId,
          users: groupUsers,
        },
      },
    });
    const { body } = await restOperation.response;
    const response = await body.json();
    console.log("PUT call succeeded: ", response);
    return response;
  } catch (error) {
    console.error("PUT call failed: ", error);
  }

  return null;
};
