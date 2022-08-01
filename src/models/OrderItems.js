import { DataTypes } from "sequelize";
import { sequelize } from "../config";
import Item from "./Item";
import Order from "./Order";
import User from "./User";

const OrderItems = sequelize.define(
  'order_items',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

Order.belongsToMany(Item, { 
  through: OrderItems, //tabela/modelo associativa
  as: 'items', //'Livros'
  foreignKey: {
    name: 'idOrder',
    field: 'id_order',
    allowNull: false
  } 
});

Item.belongsToMany(Order, {
  through: OrderItems,
  as: 'orders',
  foreignKey: {
    name: 'idItem',
    field: 'id_Item',
    allowNull: false
  }
});

export default OrderItems;
