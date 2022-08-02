import { DataTypes } from "sequelize";
import { sequelize } from "../config";

const Category = sequelize.define(
  'categories',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: false
    }
  },
  {
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

export default Category;
