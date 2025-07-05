import { DataTypes } from "sequelize";

export const defineUsuario = (sequelize) => {
    return sequelize.define("Usuario", {
        id: {
            type: DataTypes.BIGINT, // Cambiado de INTEGER a BIGINT
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
        },
        recoveryCode: {
            type: DataTypes.STRING,
            allowNull: true
        },
        recoveryExpires: {
            type: DataTypes.BIGINT,
            allowNull: true
        }
    }, {
        freezeTableName: true
    });
}; 