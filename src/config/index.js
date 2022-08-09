import { Sequelize } from "sequelize";
import 'dotenv/config';

export const sequelize = new Sequelize(
  'crstore-api',
  'postgres',
  '88725291',
  {
    host: 'localhost',
    dialect: 'postgres'
  }
);
