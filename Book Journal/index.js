// =================================================
//                 IMPORTS
// =================================================
import express from "express";          // The main framework for building the web server.
import bodyParser from "body-parser"; // Middleware to parse incoming request bodies.
import pg from "pg";                    // PostgreSQL client for Node.js.
import axios from "axios";              // A promise-based HTTP client to make requests to the API.
import dotenv from "dotenv";

// =================================================
//          APP & DATABASE INITIALIZATION
// =================================================
dotenv.config(); // <-- PENTING: Tambahkan baris ini untuk memuat file .env

const app = express();
const port = 3000;

// Kode di bawah ini sekarang akan berfungsi karena variabel sudah dimuat
const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
}); 

// Establish the connection to the database.
db.connect();

// =================================================
//                 MIDDLEWARE
// =================================================
// Use bodyParser middleware to parse URL-encoded data from forms.
app.use(bodyParser.urlencoded({ extended: true }));

// Set EJS as the default view engine for rendering templates.
app.set('view engine', 'ejs');

// Serve static files (like CSS, images) from the 'public' directory.
app.use(express.static('public'));

// =================================================
//                    ROUTES
// =================================================

/**
 * @route   GET /
 * @desc    Displays the main page with all books from the database.
 * Also handles dynamic sorting based on query parameters.
 */
app.get("/", async (req, res) => {
  // Set a default sorting order.
  let orderByClause = "ORDER BY id DESC";
  const sortOption = req.query.sort;

  // Dynamically change the SQL ORDER BY clause based on the user's selection.
  if (sortOption === "rating") {
    orderByClause = "ORDER BY rating DESC";
  } else if (sortOption === "date") {
    orderByClause = "ORDER BY date_read DESC";
  } else if (sortOption === "title") {
    orderByClause = "ORDER BY title ASC";
  }

  try {
    // Execute the query to fetch all books with the specified sorting.
    const result = await db.query(`SELECT * FROM books ${orderByClause}`);
    const books = result.rows;
    // Render the index.ejs template, passing the book data to it.
    res.render('index', { books: books });
  } catch (err) {
    console.error("Error fetching books:", err);
    res.status(500).send("Error retrieving books from database.");
  }
});

/**
 * @route   GET /add
 * @desc    Displays the page where users can search for a new book.
 */
app.get("/add", async (req, res) => {
  // Renders the add.ejs template. `results` is null initially as no search has been performed.
  res.render("add", { results: null });
});

/**
 * @route   POST /search
 * @desc    Handles the book search form submission by calling the Open Library API.
 */
app.post("/search", async (req, res) => {
  const query = req.body.query;
  try {
    // Use axios to make a GET request to the Open Library API.
    const response = await axios.get(`https://openlibrary.org/search.json?q=${query}&limit=20`);
    const searchResults = response.data.docs;
    searchResults.forEach(book => {
      // Periksa apakah properti 'ia' ada
      if (book.ia) {
        // Cari item pertama di dalam array 'ia' yang diawali dengan "isbn_"
        const iaIsbn = book.ia.find(item => item.startsWith('isbn_'));
        
        // Jika ditemukan...
        if (iaIsbn) {
          // Buat properti 'isbn' baru di objek buku dan ambil nomornya saja
          // Formatnya dibuat menjadi array agar cocok dengan kode EJS Anda
          book.isbn = [iaIsbn.substring(5)]; // Menghapus "isbn_" dari awal
        }
      }
    });
    // Re-render the add.ejs template, this time passing the search results to it.
    res.render("add", { results: searchResults });
  } catch (error) {
    console.error("Failed to fetch from API:", error.message);
    // If the API fails, render the page with an empty results array.
    res.render("add", { results: [] });
  }
});

/**
 * @route   POST /add
 * @desc    Handles the form submission for adding a new book to the database.
 * Includes server-side validation for the rating.
 */
app.post("/add", async (req, res) => {
  const { title, author, isbn, date_read, rating, notes } = req.body;
  const ratingNum = parseInt(rating, 10);

  // Server-side validation to ensure the rating is a number between 1 and 10.
  if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 10) {
    return res.status(400).send("Rating must be a number between 1 and 10.");
  }

  try {
    // Insert the new book data into the 'books' table.
    await db.query(
      "INSERT INTO books(title, author, isbn, rating, notes, date_read) VALUES ($1, $2, $3, $4, $5, $6)",
      [title, author, isbn, ratingNum, notes, date_read || null]
    );
    // Redirect the user back to the homepage after successful submission.
    
    res.redirect("/");
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).send("Failed to add book.");
  }
});

/**
 * @route   GET /edit/:id
 * @desc    Displays the edit page for a specific book, pre-filled with its current data.
 */
app.get("/edit/:id", async (req, res) => {
  const id = req.params.id;
  try {
    // Fetch the specific book from the database using its ID.
    const result = await db.query("SELECT * FROM books WHERE id = $1", [id]);
    if (result.rows.length > 0) {
      const book = result.rows[0];
      // Render the edit.ejs template, passing the book's data.
      res.render("edit", { book: book });
    } else {
      res.status(404).send("Book not found");
    }
  } catch (err) {
    console.error("Error fetching book for edit:", err);
    res.status(500).send("Failed to fetch book details.");
  }
});

/**
 * @route   POST /edit/:id
 * @desc    Handles the form submission for updating an existing book.
 */
app.post("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const { rating, notes, date_read } = req.body;
  try {
    // Update the book's details in the database where the ID matches.
    await db.query(
      "UPDATE books SET rating=$1, notes=$2, date_read=$3 WHERE id=$4",
      [rating, notes, date_read || null, id]
    );
    // Redirect back to the homepage.
    res.redirect("/");
  } catch (error) {
    console.log("Error updating book: ", error);
    res.status(500).send("Failed to update book.");
  }
});

/**
 * @route   POST /delete/:id
 * @desc    Handles the deletion of a specific book.
 */
app.post("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    // Delete the book from the database where the ID matches.
    await db.query("DELETE FROM books WHERE id=($1)", [id]);
    res.redirect("/");
  } catch (error) {
    console.log("Error deleting book: ", error);
    res.status(500).send("Failed to delete book.");
  }
});

// =================================================
//               SERVER LISTENER
// =================================================
// Start the server and listen for incoming requests on the specified port.
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});