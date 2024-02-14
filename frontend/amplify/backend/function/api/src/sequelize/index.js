const { Sequelize } = require("sequelize");
const { applyExtraSetup } = require("./extra-setup");

// In a real app, you should keep the database connection URL as an environment variable.
// But for this example, we will just use a local SQLite database.
// const sequelize = new Sequelize(process.env.DB_CONNECTION_URL);

// TODO: do better for credentials
const username = "admin";
const password = "password123";

const sequelize = new Sequelize("dropzone", username, password, {
  host: "serverless-mysql-instance-1.ccsegbn7t5iu.ca-central-1.rds.amazonaws.com",
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

// TODO: it would be nice to block on this
sequelize.sync();

// We export the sequelize connection instance to be used around our app.
module.exports = sequelize;
