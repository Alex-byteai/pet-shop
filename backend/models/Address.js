import { DataTypes } from "sequelize";

export const defineAddress = (sequelize) => {
    return sequelize.define("Address", {
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
        },
        usuarioId: {
            type: DataTypes.BIGINT,
            allowNull: true
        }
    }, {
        freezeTableName: true
    });
}; 