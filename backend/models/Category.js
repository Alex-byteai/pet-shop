import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { Subcategory } from "./Subcategory.js";
import { Producto } from "./producto.js";

export const Category = sequelize.define("Category", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.STRING
    },
    featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    freezeTableName: true
});

// Relaciones
Category.hasMany(Subcategory, { foreignKey: "categoryId", as: "subcategories" });
Subcategory.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

Category.hasMany(Producto, { foreignKey: "categoryId", as: "products" });
Producto.belongsTo(Category, { foreignKey: "categoryId", as: "category" });