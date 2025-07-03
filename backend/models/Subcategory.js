import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { Producto } from "./producto.js";

export const Subcategory = sequelize.define("Subcategory", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true
});

// Relación con Producto
Subcategory.hasMany(Producto, { foreignKey: "subcategoryId", as: "products" });
Producto.belongsTo(Subcategory, { foreignKey: "subcategoryId", as: "subcategory" });