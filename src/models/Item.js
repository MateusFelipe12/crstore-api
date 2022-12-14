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
      type: DataTypes.NUMERIC(15, 2),
      allowNull: false
    },
    img: {
      type: DataTypes.STRING(2000)
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
Item.belongsTo(Category, {
  as: 'Category',
  onUpdate: 'NO ACTION',
  onDelete: 'NO ACTION',
  foreignKey: {
    name: 'idCategory',
    allowNull: false,
    field: 'id_Category'
  }
})
export default Item;
