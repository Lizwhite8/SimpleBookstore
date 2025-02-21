const { Sequelize } = require("sequelize");
require("dotenv").config();

// Initialize Sequelize with the dialect
const sequelize = new Sequelize(
    process.env.DB_NAME,  // Database name
    process.env.DB_USER,  // MySQL username
    process.env.DB_PASS,  // MySQL password
    {
        host: process.env.DB_HOST,  // MySQL server host
        dialect: "mysql",  // Explicitly define the dialect
        logging: false  // Optional: Disable logging SQL queries in the console
    }
);

// Test Database Connection
sequelize.authenticate()
    .then(() => console.log("✅ Database connected successfully!"))
    .catch(err => console.log("❌ Database connection error: " + err));

module.exports = sequelize;
