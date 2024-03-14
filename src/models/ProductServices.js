const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const Business = require("./Business");

class ProductServices extends Model {}

ProductServices.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
    },
    description: {
      type: DataTypes.TEXT,
    },
    businessId: {
      type: DataTypes.BIGINT,
    },
    type: {
      type: DataTypes.INTEGER,
      comment: "1 = Product, 2 = Service",
    },
    createdAt: {
      type: DataTypes.STRING,
    },
    updatedAt: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "ProductServices",
    timestamps: false,
    sequelize,
  }
);

ProductServices.belongsTo(Business, {
  foreignKey: "businessId",
  as: "business",
});

module.exports = ProductServices;
