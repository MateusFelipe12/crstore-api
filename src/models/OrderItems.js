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
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    valueUnit: {
      type: DataTypes.NUMERIC(15,2),
      allowNull: false,
    },
    valueTotal: {
      type: DataTypes.NUMERIC(15,2),
      allowNull: false,
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

Order.belongsToMany(Item, { 
  through: OrderItems, 
  as: 'items', 
  foreignKey: {
    name: 'idOrder',
    field: 'id_order',
    allowNull: false
  } 
});

Item.belongsToMany(Order, {
  through: OrderItems,
  as: 'orders',
  onUpdate: 'NO ACTION',
  onDelete: 'NO ACTION',
  foreignKey: {
    name: 'idItem',
    field: 'id_Item',
    allowNull: false
  }
});

export default OrderItems;
