const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const User = require("./User");

class Chat extends Model {}

Chat.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    chatSenderId: {
      type: DataTypes.BIGINT,
    },
    personId: {
      type: DataTypes.BIGINT,
    },
    createdAt: {
        type: DataTypes.STRING,
    },
  },
  {
    tableName: "Chat",
    timestamps: false,
    sequelize,
  }
);

Chat.belongsTo(User, { foreignKey: "chatSenderId", as: "chatsender" });
Chat.belongsTo(User, { foreignKey: "personId", as: "receive" });

module.exports = Chat;
