import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Address = sequelize.define("Address", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    street: {
        type: DataTypes.STRING
    },
    city: {
        type: DataTypes.STRING
    },
    state: {
        type: DataTypes.STRING
    },
    zipCode: {
        type: DataTypes.STRING
    },
    country: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true
});