export const setupAssociations = (Usuario, Address, Order, Item, Producto, Category, Subcategory) => {
    // Usuario - Address (1:1)
    Usuario.hasOne(Address, { foreignKey: 'usuarioId', as: 'address' });
    Address.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

    // Usuario - Order (1:N)
    Usuario.hasMany(Order, { foreignKey: 'usuarioId', as: 'orders' });
    Order.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

    // Order - Item (1:N)
    Order.hasMany(Item, { foreignKey: 'orderId', as: 'items' });
    Item.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

    // Producto - Item (1:N) - An item belongs to a product
    Producto.hasMany(Item, { foreignKey: 'productId', as: 'items' });
    Item.belongsTo(Producto, { foreignKey: 'productId', as: 'product' });

    // Category - Subcategory (1:N)
    Category.hasMany(Subcategory, { foreignKey: 'categoryId', as: 'subcategories' });
    Subcategory.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

    // Category - Producto (1:N)
    Category.hasMany(Producto, { foreignKey: 'categoryId', as: 'products' });
    Producto.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

    // Subcategory - Producto (1:N)
    Subcategory.hasMany(Producto, { foreignKey: 'subcategoryId', as: 'productsBySubcategory' });
    Producto.belongsTo(Subcategory, { foreignKey: 'subcategoryId', as: 'productSubcategory' });
}; 