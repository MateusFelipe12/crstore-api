import { DataTypes } from "sequelize";
import { sequelize } from "../config";
import PaymentMethod from "./PaymentMethod";
import User from "./User";

const Order = sequelize.define(
  'orders',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    valueTotal: {
      type: DataTypes.NUMERIC(15, 2)
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: false
    },
    district: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: false
    },
    address: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: false
    },
    complement: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: false
    },
    number: {
      type: DataTypes.INTEGER(),
      allowNull: false,
      unique: false
    },
    description: {
      type: DataTypes.STRING(300),
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
Order.belongsTo(User, {
  as: 'UserCustumer',
  onUpdate: 'NO ACTION',
  onDelete: 'NO ACTION',
  foreignKey: {
    name: 'idUserCustumer',
    allowNull: false,
    field: 'id_custumer'
  }
})
Order.belongsTo(User, {
  as: 'UserDeliveryMan',
  onUpdate: 'NO ACTION',
  onDelete: 'NO ACTION',
  foreignKey: {
    name: 'idUserDeliveryMan',
    field: 'id_delivery_man'
  }
})
Order.belongsTo(PaymentMethod, {
  as: 'PaymentMethod',
  onUpdate: 'NO ACTION',
  onDelete: 'NO ACTION',
  foreignKey: {
    name: 'IdPaymentMethod',
    field: 'id_payment_method'
  }
})

export default Order;