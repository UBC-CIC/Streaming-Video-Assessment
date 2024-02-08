const {
  CognitoIdentityClient,
  GetIdCommand,
  GetCredentialsForIdentityCommand,
} = require("@aws-sdk/client-cognito-identity");
const {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  RespondToAuthChallengeCommand,
} = require("@aws-sdk/client-cognito-identity-provider");

// TODO: make this a superuser
const USER_POOL_ID = "ca-central-1_RGMoyaPVY";
const IDENTITY_POOL_ID = "ca-central-1:4d36dab8-27bc-431b-94ff-d134a25a89ce";
const REGION = "ca-central-1";
const TEST_USERNAME = "1c1d25d8-d001-7037-7c64-a30371112e53";
const TEST_PASSWORD = "Password123!";
const CLIENT_ID = "pslvatj55d6as87b8cj12i0r5";

module.exports = async function getCredentials() {
  const cognitoIdentityProviderClient = new CognitoIdentityProviderClient({
    region: REGION,
  });

  const initiateAuthCommand = new InitiateAuthCommand({
    AuthFlow: "USER_PASSWORD_AUTH",
    AuthParameters: {
      USERNAME: TEST_USERNAME,
      PASSWORD: TEST_PASSWORD,
    },
    ClientId: CLIENT_ID,
  });
  const initiateAuthResponse =
    await cognitoIdentityProviderClient.send(initiateAuthCommand);

  // Below code is needed for NEW_PASSWORD_REQUIRED auth challenge for first time users

  // const respondToAuthChallengeCommand = new RespondToAuthChallengeCommand({
  //     ChallengeName: initiateAuthResponse.ChallengeName,
  //     ChallengeResponses: {
  //         NEW_PASSWORD: "Password123!",
  //         USERNAME: TEST_USERNAME
  //     },
  //     ClientId: CLIENT_ID,
  //     Session: initiateAuthResponse.Session
  // })
  // const respondToAuthChallengeResponse = await cognitoIdentityProviderClient.send(respondToAuthChallengeCommand);

  const cognitoIdentityClient = new CognitoIdentityClient({ region: REGION });

  const getIdCommand = new GetIdCommand({
    IdentityPoolId: IDENTITY_POOL_ID,
    Logins: {
      [`cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`]:
        initiateAuthResponse.AuthenticationResult.IdToken,
    },
  });
  const getIdResponse = await cognitoIdentityClient.send(getIdCommand);

  const getCredentialsForIdentityCommand = new GetCredentialsForIdentityCommand(
    {
      IdentityId: getIdResponse.IdentityId,
      Logins: {
        [`cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`]:
          initiateAuthResponse.AuthenticationResult.IdToken,
      },
    },
  );
  const getCredentialsForIdentityResponse = await cognitoIdentityClient.send(
    getCredentialsForIdentityCommand,
  );

  const credentials = {
    accessKeyId: getCredentialsForIdentityResponse.Credentials.AccessKeyId,
    secretAccessKey: getCredentialsForIdentityResponse.Credentials.SecretKey,
    sessionToken: getCredentialsForIdentityResponse.Credentials.SessionToken,
  };

  return credentials;
};
