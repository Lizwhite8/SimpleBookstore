const express = require("express");
const { Category, Book } = require("../models");
const { sequelize } = require("../models"); // Import sequelize instance
const router = express.Router();

// Get all categories with book count
router.get("/", async (req, res) => {
    try {
        const categories = await Category.findAll({
            attributes: {
                include: [
                    [
                        sequelize.literal('(SELECT COUNT(*) FROM Books WHERE Books.categoryId = Category.id)'),
                        'bookCount'
                    ]
                ]
            },
            order: [['name', 'ASC']] // Optional: order by name
        });
        res.json(categories);
    } catch (error) {
        console.error("Error in GET /categories:", error);
        res.status(500).json({ message: "Error fetching categories", error: error.message });
    }
});

// Add a category
router.post("/", async (req, res) => {
    try {
        const { name } = req.body;
        
        if (!name || name.trim() === '') {
            return res.status(400).json({ message: "Category name is required" });
        }
        
        const category = await Category.create({ name });
        res.status(201).json(category);
    } catch (error) {
        console.error("Error in POST /categories:", error);
        res.status(400).json({ message: "Error adding category", error: error.message });
    }
});

// Get a specific category
router.get("/:id", async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id, {
            include: [Book]
        });
        
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        
        res.json(category);
    } catch (error) {
        console.error("Error in GET /categories/:id:", error);
        res.status(500).json({ message: "Error fetching category", error: error.message });
    }
});

// Delete a category
router.delete("/:id", async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        
        // Check if the category has associated books
        const bookCount = await Book.count({ where: { categoryId: req.params.id } });
        
        if (bookCount > 0) {
            return res.status(400).json({ 
                message: "Cannot delete category with associated books",
                count: bookCount
            });
        }
        
        await category.destroy();
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        console.error("Error in DELETE /categories/:id:", error);
        res.status(500).json({ message: "Error deleting category", error: error.message });
    }
});

// Update a category
router.put("/:id", async (req, res) => {
    try {
        const { name } = req.body;
        
        if (!name || name.trim() === '') {
            return res.status(400).json({ message: "Category name is required" });
        }
        
        const category = await Category.findByPk(req.params.id);
        
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        
        category.name = name;
        await category.save();
        
        res.json(category);
    } catch (error) {
        console.error("Error in PUT /categories/:id:", error);
        res.status(400).json({ message: "Error updating category", error: error.message });
    }
});

module.exports = router;