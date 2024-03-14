const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const User = require("./User");

class Business extends Model {}

Business.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    businessName: {
      type: DataTypes.STRING(255),
    },
    businessDetails: {
      type: DataTypes.TEXT,
    },
    pan: {
      type: DataTypes.STRING(255),
    },
    gstIn: {
      type: DataTypes.STRING(255),
    },
    website: {
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
    phoneNo: {
      type: DataTypes.STRING(20),
    },
    email: {
      type: DataTypes.STRING(255),
    },
    userId: {
      type: DataTypes.BIGINT,
    },
    status: {
      type: DataTypes.INTEGER,
      comment: "1 = Active, 2 = Not-active",
    },
    createdAt: {
      type: DataTypes.STRING(255),
    },
    updatedAt: {
      type: DataTypes.STRING(255),
    },
  },
  {
    tableName: "Business",
    timestamps: false,
    sequelize,
  }
);

Business.belongsTo(User, { foreignKey: "userId", as: "users" });

module.exports = Business;
