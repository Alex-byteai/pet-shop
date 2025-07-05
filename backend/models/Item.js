import { DataTypes } from "sequelize";

export const defineItem = (sequelize) => {
    return sequelize.define("Item", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        orderId: {
            type: DataTypes.BIGINT, // Cambiado de INTEGER a BIGINT
            allowNull: false
        },
        productId: {
            type: DataTypes.BIGINT, // Cambiado de INTEGER a BIGINT
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        freezeTableName: true
    });
}; 