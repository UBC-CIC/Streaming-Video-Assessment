const {
  S3Client,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const BUCKET = process.env.BUCKET_NAME;

const initializeUpload = async (key) => {
  console.log("Initialize UPLOAD");

  const s3 = new S3Client();

  const params = {
    Bucket: BUCKET,
    Key: key,
    ContentType: "video/webm",
  };

  const createMultipartUploadCommand = new CreateMultipartUploadCommand(params);

  const createUploadResponse = await s3.send(createMultipartUploadCommand);

  return createUploadResponse.UploadId;
};

const getUploadUrl = async (key, uploadId, partNumber) => {
  const s3 = new S3Client();

  const params = {
    Bucket: BUCKET,
    Key: key,
    UploadId: uploadId,
    PartNumber: partNumber,
  };

  const uploadPartCommand = new UploadPartCommand(params);

  // TODO: when should this expire?
  return await getSignedUrl(s3, uploadPartCommand, { expiresIn: 3600 });
};

const completeUpload = async (key, uploadId, parts) => {
  const s3 = new S3Client();

  const params = {
    Bucket: BUCKET,
    Key: key,
    UploadId: uploadId,
    MultipartUpload: {
      Parts: parts,
    },
  };

  return await s3.send(new CompleteMultipartUploadCommand(params));
};

// TODO: do we need to authenticate this
const getUrlForKey = async (key) => {
  const s3 = new S3Client();

  const params = {
    Bucket: BUCKET,
    Key: key,
  };

  return await getSignedUrl(s3, new GetObjectCommand(params), {
    expiresIn: 3600,
  });
};

module.exports = {
  initializeUpload,
  getUploadUrl,
  getUrlForKey,
  completeUpload,
};
