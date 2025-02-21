// routes/bookRoutes.js
const express = require("express");
const { Book, Category } = require("../models");
const router = express.Router();

// Get all books with their category
router.get("/", async (req, res) => {
    try {
        const books = await Book.findAll({
            include: [{ model: Category, attributes: ['id', 'name'] }],
            order: [['id', 'DESC']] // Most recent books first
        });
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books", error: error.message });
    }
});
// Get a single book by ID
router.get("/:id", async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id, {
            include: [{ model: Category, attributes: ['id', 'name'] }]
        });
        
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: "Error fetching book", error: error.message });
    }
});

// Get books by category
router.get("/category/:categoryId", async (req, res) => {
    try {
        const books = await Book.findAll({
            where: { categoryId: req.params.categoryId },
            include: [{ model: Category, attributes: ['id', 'name'] }]
        });
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by category", error: error.message });
    }
});

// Add a book
router.post("/", async (req, res) => {
    try {
        const { title, author, image, category, description } = req.body;
        
        // Find or create the category
        let [categoryObj] = await Category.findOrCreate({
            where: { name: category }
        });
        
        // Create the book with the category ID
        const book = await Book.create({
            title,
            author,
            image,
            description: description || undefined, // Use default if not provided
            categoryId: categoryObj.id
        });
        
        // Return the book with its category
        const bookWithCategory = await Book.findByPk(book.id, {
            include: [{ model: Category, attributes: ['id', 'name'] }]
        });
        
        res.json(bookWithCategory);
    } catch (error) {
        res.status(400).json({ message: "Error adding book", error: error.message });
    }
});

// Delete a book
router.delete("/:id", async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        
        const categoryId = book.categoryId;
        
        // Delete the book
        await book.destroy();
        
        // Check if category has other books
        const booksInCategory = await Book.count({
            where: { categoryId }
        });
        
        // If no books are left in this category, delete the category
        if (booksInCategory === 0) {
            await Category.destroy({
                where: { id: categoryId }
            });
        }
        
        res.json({ 
            message: "Book deleted",
            categoryDeleted: booksInCategory === 0,
            categoryId: booksInCategory === 0 ? categoryId : null
        });
    } catch (error) {
        res.status(500).json({ message: "Error deleting book", error: error.message });
    }
});

module.exports = router;