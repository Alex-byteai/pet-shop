import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { Order } from "./order.js";
import { Producto } from "./producto.js";

// Modelo intermedio para los items de la orden
export const Item = sequelize.define("Item", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    orderid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    freezeTableName: true
});

// Relaciones (opcional, si quieres que Item.js sea autocontenible)
// Item pertenece a una orden
Item.belongsTo(Order, { foreignKey: "orderid" });
// Item pertenece a un producto
Item.belongsTo(Producto, { foreignKey: "productId" });
