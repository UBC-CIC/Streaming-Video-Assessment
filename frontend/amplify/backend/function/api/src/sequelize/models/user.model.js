const { DataTypes } = require("sequelize");

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
  sequelize.define("user", {
    // TODO: Add cognito user id or reference to cognito user and add unique index
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    isPlatformManager: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isAssessmentCreator: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });
};
