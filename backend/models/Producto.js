import { DataTypes } from "sequelize";

export const defineProducto = (sequelize) => {
    return sequelize.define("Producto", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        brand: {
            type: DataTypes.STRING
        },
        rating: {
            type: DataTypes.FLOAT
        },
        stock: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        images: {
            type: DataTypes.ARRAY(DataTypes.STRING)
        },
        isNew: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isBestSeller: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        soldCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: true // Will be set by association
        },
        subcategoryId: {
            type: DataTypes.INTEGER,
            allowNull: true // Will be set by association
        }
    }, {
        freezeTableName: true
    });
}; 