const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("uploadRequest", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    uploaderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    assessmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
};
