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
    timeLimitMinutes: 30,
    allowFaceBlur: true,
  };
};

// just for mocking
const backend_parts = [];

export const initializeUpload = async (assignmentId, secret) => {
  // const restOperation = post({
  //   apiName: "backend",
  //   path: `/api/init-upload`,
  //   options: {
  //     body: {
  //       assignmentId,
  //       secret,
  //     },
  //   },
  // });

  // const { body } = await restOperation.response;
  // return await body.json();
  console.log("Initialize UPLOAD");
  while (backend_parts.length) backend_parts.pop();

  return {
    uploadId: "1234",
    signedUrl: "http://localhost:3000/0",
    partNumber: 0,
  };
};

export const completeUpload = async (assignmentId, secret, uploadId, parts) => {
  // const restOperation = post({
  //   apiName: "backend",
  //   path: `/api/complete-upload`,
  //   options: {
  //     body: {
  //       assignmentId,
  //       secret,
  //       uploadId,
  //       parts,
  //     },
  //   },
  // });

  // const { body } = await restOperation.response;
  // return await body.json();

  const blob = new Blob(backend_parts, {
    type: "video/webm",
  });
  const url = URL.createObjectURL(blob);

  console.log("COMPLETED UPLOAD", parts);
  return url; // signed url to the completed file
};

export const getNextUploadUrl = async (
  assignmentId,
  secret,
  uploadId,
  partNumber,
) => {
  // const restOperation = post({
  //   apiName: "backend",
  //   path: `/api/next-upload-url`,
  //   options: {
  //     body: {
  //       assignmentId,
  //       secret,
  //       uploadId,
  //       partNumber,
  //     },
  //   },
  // });

  // const { body } = await restOperation.response;
  // return await body.json();

  console.log("GETTING NEXT UPLOAD URL", partNumber);

  return { partNumber, signedUrl: `http://localhost:3000/${partNumber}` };
};

export const uploadPart = async (url, blob) => {
  console.log("Uploading part to", url);

  backend_parts.push(blob);

  // const response = await fetch(url, {
  //   method: "PUT",
  //   body: blob,
  // });

  return "etag" + url;
  return response.headers.get("ETag");
};
