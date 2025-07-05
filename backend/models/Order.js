import { DataTypes } from "sequelize";

export const defineOrder = (sequelize) => {
    return sequelize.define("Order", {
        orderid: {
            type: DataTypes.BIGINT, // Cambiado de INTEGER a BIGINT
            primaryKey: true,
            autoIncrement: true
        },
        date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: "pendiente"
        },
        total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        usuarioId: {
            type: DataTypes.BIGINT,
            allowNull: true
        }
    }, {
        freezeTableName: true
    });
}; 