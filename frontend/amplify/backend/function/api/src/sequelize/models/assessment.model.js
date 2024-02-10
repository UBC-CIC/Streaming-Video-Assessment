const { DataTypes } = require("sequelize");

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
  sequelize.define(
    "assessment",
    {
      // The following specification of the 'id' attribute could be omitted
      // since it is the default.
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      folderId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      dueDate: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      timeLimitSeconds: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      faceBlurAllowed: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["name", "folderId"],
        },
      ],
    },
  );
};
