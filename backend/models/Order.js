import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { Usuario } from "./Usuario.js";
import { Producto } from "./producto.js";
import { Item } from "./Item.js";

// Modelo principal: Order
export const Order = sequelize.define("Order", {
    orderid: {
        type: DataTypes.INTEGER,
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
    }
}, {
    freezeTableName: true
});

// Relaciones

// Un usuario puede tener muchas órdenes
Usuario.hasMany(Order, { foreignKey: "userid", as: "orders" });
Order.belongsTo(Usuario, { foreignKey: "userid", as: "usuario" });

// Una orden puede tener muchos ítems
Order.hasMany(Item, { foreignKey: "orderid", as: "items" });
Item.belongsTo(Order, { foreignKey: "orderid" });

// Un producto puede estar en muchos ítems
Producto.hasMany(Item, { foreignKey: "productId" });
Item.belongsTo(Producto, { foreignKey: "productId" });
