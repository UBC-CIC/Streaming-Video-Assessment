import { post } from "aws-amplify/api";

export const getAssignmentInfo = async (assignmentId, secret) => {
  console.log("FETCHED");

  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    secret,
    id: assignmentId,
    completedOn: null,
    name: "Spanish 30 Final",
    description: "This is a description of the assignment",
    dueDate: "2021-12-31",
    timeLimitSeconds: 65,
    allowFaceBlur: true,
  };
};

export const initializeUpload = async (assignmentId, secret) => {
  console.log("init upload", { assignmentId, secret });
  const restOperation = post({
    apiName: "backend",
    path: `/api/submission/init-upload`,
    options: {
      body: {
        assignmentId,
        secret,
      },
    },
  });

  const { body } = await restOperation.response;
  return await body.json();
};

export const completeUpload = async (assignmentId, secret, uploadId, parts) => {
  const restOperation = post({
    apiName: "backend",
    path: `/api/submission/complete-upload`,
    options: {
      body: {
        assignmentId,
        secret,
        uploadId,
        parts: parts.map((part) => ({
          ETag: part.etag,
          PartNumber: part.partNumber,
        })),
      },
    },
  });

  const { body } = await restOperation.response;
  return await body.json();
};

export const getNextUploadUrl = async (
  assignmentId,
  secret,
  uploadId,
  partNumber,
) => {
  const restOperation = post({
    apiName: "backend",
    path: `/api/submission/next-upload-url`,
    options: {
      body: {
        assignmentId,
        secret,
        uploadId,
        partNumber,
      },
    },
  });

  const { body } = await restOperation.response;
  return await body.json();
};

export const uploadPart = async (url, blob) => {
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "video/webm",
    },
    body: blob,
  });

  const etag = response.headers.get("Etag");
  return etag.substring(1, etag.length - 1);
};
