const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
    },
    email: {
      type: DataTypes.STRING(255),
    },
    address: {
      type: DataTypes.TEXT,
    },
    city: {
      type: DataTypes.STRING(255),
    },
    state: {
      type: DataTypes.STRING(255),
    },
    zipCode: {
      type: DataTypes.STRING(55),
    },
    password: {
      type: DataTypes.TEXT,
    },
    phone: {
      type: DataTypes.STRING(55),
    },
    photo: {
      type: DataTypes.STRING(100),
    },
    userType: {
      type: DataTypes.INTEGER,
      comment: "1 = Admin, 2 = Business User, 3 = Customer",
    },
    fpToken: {
      type: DataTypes.STRING(255),
    },
    createdAt: {
      type: DataTypes.STRING,
    },
    updatedAt: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "User",
    timestamps: false,
    sequelize,
  }
);

module.exports = User;
