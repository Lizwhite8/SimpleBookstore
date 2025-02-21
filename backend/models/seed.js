// models/seed.js
// Import directly from the model files instead of index.js
const Book = require('./Book');
const Category = require('./Category');

// Sample book data with categories
const sampleBooks = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Fiction",
    image: "https://via.placeholder.com/300x400/87CEEB/000000?text=The+Great+Gatsby",
    description: "A classic novel about the American Dream in the 1920s, following the mysterious millionaire Jay Gatsby and his obsession with the beautiful Daisy Buchanan."
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    category: "Fiction",
    image: "https://via.placeholder.com/300x400/90EE90/000000?text=To+Kill+a+Mockingbird",
    description: "The story of Scout Finch and her father, lawyer Atticus Finch, who defends a Black man accused of raping a white woman in the Deep South."
  },
  {
    title: "1984",
    author: "George Orwell",
    category: "Science Fiction",
    image: "https://via.placeholder.com/300x400/FFA07A/000000?text=1984",
    description: "A dystopian novel depicting a totalitarian society where critical thought is suppressed and government surveillance is omnipresent."
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    category: "Fantasy",
    image: "https://via.placeholder.com/300x400/FFD700/000000?text=The+Hobbit",
    description: "The adventure of Bilbo Baggins, a hobbit who is swept into an epic quest to reclaim the dwarf kingdom of Erebor from the fearsome dragon Smaug."
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    category: "Romance",
    image: "https://via.placeholder.com/300x400/FFB6C1/000000?text=Pride+and+Prejudice",
    description: "The story of Elizabeth Bennet's relationship with the proud Mr. Darcy in Georgian-era England, dealing with issues of marriage, morality and misconceptions."
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    category: "Fiction",
    image: "https://via.placeholder.com/300x400/ADD8E6/000000?text=Catcher+in+the+Rye",
    description: "The story of teenager Holden Caulfield and his experiences in New York City after being expelled from prep school."
  },
  {
    title: "Brave New World",
    author: "Aldous Huxley",
    category: "Science Fiction",
    image: "https://via.placeholder.com/300x400/F08080/000000?text=Brave+New+World",
    description: "A dystopian novel about a futuristic society where people are engineered in laboratories and conditioned to serve societal needs."
  },
  {
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    category: "Fantasy",
    image: "https://via.placeholder.com/300x400/FFDEAD/000000?text=Lord+of+the+Rings",
    description: "An epic fantasy novel about the quest to destroy the One Ring and defeat the Dark Lord Sauron."
  }
];

// Function to seed the database with sample data
async function seedDatabase() {
    try {
      // Create categories and books
      for (const bookData of sampleBooks) {
        // Find or create the category
        const [category] = await Category.findOrCreate({
          where: { name: bookData.category }
        });
        
        // Create the book with the category ID
        await Book.create({
          title: bookData.title,
          author: bookData.author,
          image: bookData.image,
          description: bookData.description,
          categoryId: category.id
        });
      }
      
      console.log('✅ Database seeded successfully');
    } catch (error) {
      console.error('❌ Error seeding database:', error);
    }
  }
  
  module.exports = seedDatabase;