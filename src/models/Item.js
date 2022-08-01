import { DataTypes } from "sequelize";
import { sequelize } from "../config";
import Category from "./Category";

const Item = sequelize.define(
  'items',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.NUMERIC(15,2),
      allowNull: false
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);
Item.belongsTo( Category, {
  as: 'Category',
  foreignKey: {
    name: 'idCategory',
    allowNull: false,
    field: 'id_Category'
  }
})
export default Item;
