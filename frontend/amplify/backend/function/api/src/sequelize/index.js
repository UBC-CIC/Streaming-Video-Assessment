const { Sequelize } = require("sequelize");
const { applyExtraSetup } = require("./extra-setup");
const { GetSecretValueCommand, SecretsManagerClient } = require("@aws-sdk/client-secrets-manager");

// In a real app, you should keep the database connection URL as an environment variable.
// But for this example, we will just use a local SQLite database.
// const sequelize = new Sequelize(process.env.DB_CONNECTION_URL);

let sequelize;

if (process.env.NODE_ENV === "test") {
  sequelize = new Sequelize("sqlite::memory:");
} else {

  const secretsManagerClient = new SecretsManagerClient();
  const getSecretValueResponse = await secretsManagerClient.send(
    new GetSecretValueCommand({
      SecretId: process.env.SECRET_NAME
    })
  )
  console.log(getSecretValueResponse)

  sequelize = new Sequelize("dropzone", username, password, {
    host: process.env.DATABASE_ENDPOINT,
    dialect: "mysql",
  });
}

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

// We export the sequelize connection instance to be used around our app.
module.exports = sequelize;
