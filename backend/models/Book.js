// models/Book.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Book = sequelize.define("Book", {
    title: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    author: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    image: { 
        type: DataTypes.STRING, 
        allowNull: true,
        defaultValue: "https://via.placeholder.com/300x400?text=Book+Cover" 
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris."
    }
}, {
    timestamps: false
});

module.exports = Book;