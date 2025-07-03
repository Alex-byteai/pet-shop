import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { Address } from "./Address.js";

export const Usuario = sequelize.define("Usuario", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: "cliente"
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    registerDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    lastLogin: {
        type: DataTypes.DATE
    },
    phone: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true
});

// Relación 1:1 con Address
Usuario.hasOne(Address, { foreignKey: "usuarioId", as: "address" });
Address.belongsTo(Usuario, { foreignKey: "usuarioId", as: "usuario" });