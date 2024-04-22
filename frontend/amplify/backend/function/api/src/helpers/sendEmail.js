const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

async function sendEmail(toAddresses, subject, message) {
  console.log(
    "Sending email to",
    toAddresses,
    "with subject",
    subject,
    "and message",
    message,
  );

  if (process.env.NODE_ENV === "test") {
    return true;
  }

  const ses = new SESClient();

  // https://stackoverflow.com/questions/37528301/email-address-is-not-verified-aws-ses
  // When your SES account is in "sandbox" mode, you can:
  //  1. Only send from verified domains and email addressed, and
  //  2. Only send to verified domains and email addresses.
  // In order to send to anyone else, you must move your account out of
  //   sandbox mode by contacting AWS support and requesting it:
  // https://docs.aws.amazon.com/console/ses/sandbox

  try {
    await ses.send(
      new SendEmailCommand({
        Destination: {
          ToAddresses: toAddresses,
        },
        Message: {
          Body: {
            Text: {
              Data: message,
            },
          },
          Subject: {
            Data: subject,
          },
        },
        Source: "sf.21.2024.capstone@gmail.com",
      }),
    );
  } catch (e) {
    console.error("Error sending email:", e);
    return false;
  }

  return true;
}

async function sendUploadRequestEmail(uploader, assessment, uploadRequest) {
  const url = `https://main.dmcvp4nfj9t9x.amplifyapp.com/submit/${assessment.id}?secret=${uploadRequest.id}`;

  const subject = `Upload Request for ${assessment.name}`;
  const message =
    `Hello ${uploader.name},\n\n` +
    `You have been requested to upload a video for the assessment ` +
    `${assessment.name}.\n\n` +
    `Please visit the following link to upload your video:\n` +
    `${url}\n\n` +
    `Thank you,\n` +
    `The Dropzone Team`;

  return await sendEmail([uploader.email], subject, message);
}

module.exports = { sendEmail, sendUploadRequestEmail };
