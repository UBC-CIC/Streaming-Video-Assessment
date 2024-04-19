import { post, get } from "aws-amplify/api";

export const getAssessmentInfo = async (assessmentId, secret) => {
  console.log("FETCHED");

  const restOperation = get({
    apiName: "backend",
    path: `/api/submission/assessment-info/${assessmentId}`,
    options: {
      queryParams: { secret },
    },
  });

  const { body } = await restOperation.response;
  return await body.json();
};

export const initializeUpload = async (assessmentId, secret) => {
  console.log("init upload", { assessmentId, secret });
  const restOperation = post({
    apiName: "backend",
    path: `/api/submission/init-upload`,
    options: {
      body: {
        assessmentId,
        secret,
      },
    },
  });

  const { body } = await restOperation.response;
  return await body.json();
};

export const completeUpload = async (assessmentId, secret, uploadId, parts) => {
  const restOperation = post({
    apiName: "backend",
    path: `/api/submission/complete-upload`,
    options: {
      body: {
        assessmentId,
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
  assessmentId,
  secret,
  uploadId,
  partNumber,
) => {
  const restOperation = post({
    apiName: "backend",
    path: `/api/submission/next-upload-url`,
    options: {
      body: {
        assessmentId,
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
      "Content-Type": "video/mp4",
    },
    body: blob,
  });

  const etag = response.headers.get("Etag");
  return etag.substring(1, etag.length - 1);
};

export const submitVideo = async (assessmentId, secret) => {
  const restOperation = post({
    apiName: "backend",
    path: `/api/submission/submit`,
    options: {
      body: {
        assessmentId,
        secret,
      },
    },
  });

  const resp = await restOperation.response;
  return resp.statusCode;
};
