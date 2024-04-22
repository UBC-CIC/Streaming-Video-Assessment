const region = process.env.REGION;
const userPoolId = process.env.USER_POOL_ID;
const clientId = process.env.APP_CLIENT_ID_WEB;

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