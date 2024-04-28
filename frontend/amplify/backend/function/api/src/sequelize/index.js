const { Sequelize } = require("sequelize");
const { applyExtraSetup } = require("./extra-setup");
const { GetSecretValueCommand, SecretsManagerClient } = require("@aws-sdk/client-secrets-manager");

let sequelizePromise;

if (process.env.NODE_ENV === "test") {
  sequelizePromise = Promise.resolve(new Sequelize("sqlite::memory:"));
} else {
  sequelizePromise = new Promise((resolve, reject) => {
    const secretsManagerClient = new SecretsManagerClient();
    secretsManagerClient.send(
      new GetSecretValueCommand({
        SecretId: process.env.SECRET_NAME
      })
    ).then((response) => {
      const secret = JSON.parse(response.SecretString)
      const username = secret.username
      const password = secret.password

      const sequelize = new Sequelize("dropzone", username, password, {
        host: process.env.DATABASE_ENDPOINT,
        dialect: "mysql",
      });
      const modelDefiners = [
        require("./models/assessment.model"),
        require("./models/folder.model"),
        require("./models/uploader.model"),
        require("./models/uploaderGroup.model"),
        require("./models/uploadRequest.model"),
        require("./models/user.model"),
        require("./models/video.model"),
      ];
      
      // We define all models according to their files.
      for (const modelDefiner of modelDefiners) {
        modelDefiner(sequelize);
      }
      
      // We execute any extra setup after the models are defined, such as adding associations.
      applyExtraSetup(sequelize);
      
      resolve(sequelize)
    }).catch((err) => {
      console.log(err)
      reject(err)
    })
  })
}

// We export the sequelize connection instance to be used around our app.
module.exports = sequelizePromise;