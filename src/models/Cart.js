import { DataTypes } from "sequelize";
import { sequelize } from "../config";
import Item from "./Item";
import Order from "./Order";
import User from "./User";

const Cart = sequelize.define(
  'cart',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    items: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
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

Cart.belongsTo( User, {
  as: 'User',
  onUpdate: 'NO ACTION',
  onDelete: 'NO ACTION',
  foreignKey: {
    name: 'idUser',
    allowNull: false,
    field: 'id_user'
  }
})

export default Cart;
