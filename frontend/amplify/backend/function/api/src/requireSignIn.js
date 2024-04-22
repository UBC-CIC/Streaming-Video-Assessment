const region = "ca-central-1";
const userPoolId = "ca-central-1_RGMoyaPVY";
const clientId = "2q1vlf8f8vkl965un3pists4bo";

const jwksUrl = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
var jwt = require("jsonwebtoken");
var jwksClient = require("jwks-rsa");
var client = jwksClient({
  jwksUri: jwksUrl,
});
function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    var signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

async function requireSignIn(req, res, next) {
    // console.log("method: ", req.method);
    const claim = req.headers.authorization;
    // console.log("claim: ", claim);
    jwt.verify(
      claim,
      getKey,
      {
        algorithms: ["RS256"],
        token_use: "id",
        issuer: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`,
        audience: clientId,
      },
      function (err, decodedToken) {
        if (err) {
          console.error(err);
          return res.status(401).json({ error: "Unauthorized" });
        }
        // console.log("decodedToken: ", decodedToken);
        req["userEmail"] = decodedToken.email;
        // console.log("userEmail: ", req["userEmail"]);
        next();
      },
    );
  }

  module.exports = requireSignIn;