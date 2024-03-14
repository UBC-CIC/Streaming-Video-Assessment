const {CognitoJwtVerifier} = require('aws-jwt-verify');

const verifier = CognitoJwtVerifier.create({
  userPoolId: 'ca-central-1_RGMoyaPVY',
  tokenUse: 'access',
});
async function verifyToken(req, res, next){
  try{const token = req.headers.Authorization?.split(' ')[1];
  if(!token) return res.status(401).json({message: "Unauthorized"});

  const payload = await verifier.verify(token);
  console.log('Token is valid. JWT payload: ', payload);

  req["userEmail"] = payload.email;
  next();} catch(err){
    console.log(err);
    res.status(401).json({message: "Unauthorized: Invalid token"});
  }
} 