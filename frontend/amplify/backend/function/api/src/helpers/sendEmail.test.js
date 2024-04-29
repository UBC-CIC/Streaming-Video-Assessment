const { sendEmail, sendUploadRequestEmail } = require("./sendEmail");

describe("sendEmail", () => {
  it("should send email", async () => {
    const toAddresses = ["hmitgang@student.ubc.ca"];
    const subject = "Hello!";
    const message = "This is a test https://google.com";
    const result = await sendEmail(toAddresses, subject, message);
    expect(result).toBe(true);
  });
});

describe("sendUploadRequestEmail", () => {
  it("should send upload request email", async () => {
    const uploader = {
      name: "Test User",
      email: "crabapple569@gmail.com",
    };
    const uploadRequest = { id: 123456 };
    const assessment = {
      name: "Test Upload",
      id: 123456789,
    };
    const result = await sendUploadRequestEmail(
      uploader,
      assessment,
      uploadRequest,
      "localhost:3000",
    );
    expect(result).toBe(true);
  });
});