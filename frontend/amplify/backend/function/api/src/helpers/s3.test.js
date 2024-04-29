const {
    initializeUpload,
    getUploadUrl,
    getUrlForKey,
    completeUpload,
  } = require("./s3.js");
  const { S3Client, CreateMultipartUploadCommand, UploadPartCommand, CompleteMultipartUploadCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
  const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
  const getCredentials = require("./getCredentials");
  
  jest.mock("@aws-sdk/client-s3", () => {
    const originalModule = jest.requireActual("@aws-sdk/client-s3");
    return {
      ...originalModule,
      S3Client: jest.fn(),
    };
  });
  
  jest.mock("@aws-sdk/s3-request-presigner", () => ({
    getSignedUrl: jest.fn(),
  }));
  
  jest.mock("./getCredentials", () => jest.fn());
  
  describe("S3 Operations", () => {
    const mockSend = jest.fn();
    const mockUrl = "https://example.com/part1";
    const credentials = { accessKeyId: "fake-id", secretAccessKey: "fake-key" };
  
    beforeEach(() => {
      S3Client.mockClear();
      S3Client.mockImplementation(() => ({
        send: mockSend,
      }));
      getSignedUrl.mockResolvedValue(mockUrl);
      getCredentials.mockResolvedValue(credentials);
      mockSend.mockReset();
    });
  
    describe("initializeUpload", () => {
      it("should initialize a multipart upload and return an upload ID", async () => {
        const key = "video.mp4";
        const uploadId = "123upload";
        mockSend.mockResolvedValue({ UploadId: uploadId });
  
        const result = await initializeUpload(key);
        expect(S3Client).toHaveBeenCalledWith({ credentials });
        expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({
          input: expect.objectContaining({
            Bucket: "video-storage-sf21",
            Key: key,
            ContentType: "video/webm",
          }),
        }));
        expect(result).toBe(uploadId);
      });
    });
  
    describe("completeUpload", () => {
      it("should complete the multipart upload", async () => {
        const key = "video.mp4";
        const uploadId = "123upload";
        const parts = [{ ETag: "tag", PartNumber: 1 }];
  
        await completeUpload(key, uploadId, parts);
        expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({
          input: expect.objectContaining({
            Bucket: "video-storage-sf21",
            Key: key,
            UploadId: uploadId,
            MultipartUpload: { Parts: parts },
          }),
        }));
      });
    });
  
  });
  