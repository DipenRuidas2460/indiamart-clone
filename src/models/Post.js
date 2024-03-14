const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const Business = require("./Business");

class Post extends Model {}

Post.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(255),
    },
    contentDetails: {
      type: DataTypes.TEXT,
    },
    businessId: {
      type: DataTypes.BIGINT,
    },
    createdAt: {
      type: DataTypes.STRING,
    },
    updatedAt: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "Post",
    timestamps: false,
    sequelize,
  }
);

Post.belongsTo(Business, {
  foreignKey: "businessId",
  as: "business",
});

module.exports = Post;
