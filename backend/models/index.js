// models/index.js
const sequelize = require("../config/db");
const Book = require("./Book");
const Category = require("./Category");

// Define relationships
Book.belongsTo(Category, {
    foreignKey: {
        name: 'categoryId',
        allowNull: false
    },
    onDelete: 'CASCADE'
});

Category.hasMany(Book, {
    foreignKey: 'categoryId',
    onDelete: 'CASCADE'
});

// Export the models
module.exports = { Book, Category, sequelize };

// Move seeding to server.js