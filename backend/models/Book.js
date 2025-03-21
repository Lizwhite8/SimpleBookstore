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
        defaultValue: "/images/cover/image-1.jpg" // Updated to use local image
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