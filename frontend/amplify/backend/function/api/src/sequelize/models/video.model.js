const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("video", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    assessmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    uploaderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    s3Key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    submitted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });
};
