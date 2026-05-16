import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME     ?? 'bavafy_db',
  process.env.DB_USER     ?? 'root',
  process.env.DB_PASSWORD ?? '12345678',
  {
    host:    process.env.DB_HOST ?? 'localhost',
    port:    Number(process.env.DB_PORT ?? 3306),
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      underscored:   true,   // snake_case en la BD
      timestamps:    true,
      createdAt:     'created_at',
      updatedAt:     'updated_at',
    },
  }
);