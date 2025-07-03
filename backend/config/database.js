import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('demobd', 'postgres', 'fenix0456', {
    host: 'localhost',
    dialect: 'postgres'
});

