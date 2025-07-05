import { Sequelize } from 'sequelize';

export const getSequelizeInstance = () => {
    return new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        logging: false // Optional: set to console.log to see SQL queries
    });
};
