const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const User = require("./User");
const Chat = require("./Chat");

class Message extends Model {}

Message.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    senderId: {
      type: DataTypes.BIGINT,
    },
    content: {
      type: DataTypes.TEXT,
    },
    allFiles: {
      type: DataTypes.STRING,
    },
    chatId: {
      type: DataTypes.BIGINT,
    },
    createdAt: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "Message",
    timestamps: false,
    sequelize,
  }
);

Message.belongsTo(User, { foreignKey: "senderId", as: "sender" });

Chat.hasMany(Message, { foreignKey: "chatId", as:"msg" });
Message.belongsTo(Chat, { foreignKey: "chatId", as: "msg" });

module.exports = Message;
