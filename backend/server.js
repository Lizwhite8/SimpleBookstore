const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const { Book, Category, sequelize } = require("./models");
const seedDatabase = require("./models/seed");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Import Routes
const bookRoutes = require("./routes/bookRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

// Use Routes
app.use("/books", bookRoutes);
app.use("/categories", categoryRoutes);

// Root Route
app.get("/", (req, res) => res.send("Welcome to the Bookstore API"));

// Initialize database and start server
async function initializeApp() {
  try {
    // Sync database models
    await sequelize.sync({ force: true });
    console.log("✅ Tables recreated with relationships!");
    
    // Seed the database
    await seedDatabase();
    
    // Start the server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  } catch (error) {
    console.error("❌ Error initializing application:", error);
  }
}

// Start the application
initializeApp();