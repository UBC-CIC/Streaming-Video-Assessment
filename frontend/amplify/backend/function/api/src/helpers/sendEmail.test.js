const { sendEmail } = require("./sendEmail");

describe("sendEmail", () => {
  it("should send email", async () => {
    const toAddresses = ["hmitgang@student.ubc.ca"];
    const subject = "Hello!";
    const message = "This is a test https://google.com";
    const result = await sendEmail(toAddresses, subject, message);
    expect(result).toBe(true);
  });
});
