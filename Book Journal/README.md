
📚 Book Journal - A Personal Reading Log

A full-stack web application that allows users to search for books using the Open Library API and keep a personal journal of their readings with ratings and notes, all stored in a PostgreSQL database.

## ✨ Features

CRUD Functionality: Full Create, Read, Update, and Delete capabilities for your book entries.
External API Integration: Search for any book in real-time using the Open Library Search API.
Dynamic Sorting: Sort your personal collection by title, date read, or rating.
Persistent Storage: All personal journal entries are securely stored in a PostgreSQL database.
Server-Side Rendering: A dynamic and responsive user interface built with EJS templates.
Input Validation: Ensures that user-submitted data, like ratings, is valid before being stored.

-----

🛠️ Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL (with the `pg` library)
* **View Engine:** EJS (Embedded JavaScript)
* **API Client:** Axios
* **Styling:** HTML5 & CSS3

-----

⚙️ Setup and Installation

Follow these steps to get the project running on your local machine.

1. Prerequisites

Make sure you have the following installed on your system:

  * [Node.js](https://nodejs.org/en/) (which includes `npm`)
  * [PostgreSQL](https://www.postgresql.org/download/)

2. Clone the Repository**

```bash
git clone https://github.com/farhandavin/1.5capstone_project.git
cd 1.5capstone_project
```

### **3. Install Dependencies**

Install all the necessary npm packages listed in `package.json`.

```bash
npm install
```

### **4. Set Up the PostgreSQL Database**

You need to create a database and a table for the application to store its data.

a. Open your PostgreSQL terminal (`psql`).

b. Create a new database. You can name it `jurnal` or anything you prefer.

```sql
CREATE DATABASE jurnal;
```

c. Connect to your newly created database.

```sql
\c jurnal
```

d. Create the `books` table by running the following SQL command:

```sql
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    isbn VARCHAR(20),
    rating INT CHECK (rating >= 1 AND rating <= 10),
    notes TEXT,
    date_read DATE
);
```

### **5. Configure Environment Variables**

For security, it's best practice to store your database credentials in an environment file.

a. Create a new file named `.env` in the root directory of your project.

b. Add your database connection details to the `.env` file. **Make sure this matches your local PostgreSQL setup.**

```
# .env file

DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=jurnal
DB_PASSWORD=YourSecurePassword
DB_PORT=5432
```

***Note:*** *To use this `.env` file, you would need to install `dotenv` (`npm install dotenv`) and modify `index.js` to load these variables. This is the recommended practice for any real-world application.*

### **6. Run the Server**

You can now start the application server.

```bash
# To run with automatic restarts on file changes (recommended for development)
nodemon index.js

# Or to run it simply
node index.js
```

The server should now be running on `http://localhost:3000`.

-----

## 🌐 API Reference

This project utilizes the free and open **Open Library Search API**.

  * **Endpoint:** `https://openlibrary.org/search.json`
  * **Usage:** The application sends a GET request to this endpoint with a query parameter `q` containing the book title entered by the user. For example: `https://openlibrary.org/search.json?q=the+lord+of+the+rings`.

-----

## 📜 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
