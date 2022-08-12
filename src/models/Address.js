import { DataTypes } from "sequelize";
import { sequelize } from "../config";
import User from "./User";

const Address = sequelize.define(
  'addresses',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
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

Address.belongsTo(User, {
  as: 'User',
  onUpdate: 'NO ACTION',
  onDelete: 'NO ACTION',
  foreignKey: {
    name: 'idUser',
    allowNull: false,
    field: 'id_user'
  }
});
export default Address;
