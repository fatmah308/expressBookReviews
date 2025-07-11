const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
  
    // Validate that both fields are provided
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }
  
    // Check if the username already exists
    const userExists = users.some((user) => user.username === username);
  
    if (userExists) {
      return res.status(409).json({ message: "Username already exists. Please choose another." });
    }
  
    // Add the new user
    users.push({ username, password });
  
    return res.status(201).json({ message: "User registered successfully." });
  });
// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const matchingBooks = [];

    // Step 1: Get all keys (ISBNs)
    const bookKeys = Object.keys(books);

    // Step 2 & 3: Loop through each book and check for author match
    for (let key of bookKeys) {
        if (books[key].author === author) {
            matchingBooks.push({ isbn: key, ...books[key] });
        }
    }

    // Step 4: Return result
    if (matchingBooks.length > 0) {
        res.send(JSON.stringify(matchingBooks, null, 4));
    } else {
        res.status(404).send({ message: "No books found for the given author." });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const matchingBooks = [];

    // Step 1: Get all keys (ISBNs)
    const bookKeys = Object.keys(books);

    // Step 2 & 3: Loop through each book and check for author match
    for (let key of bookKeys) {
        if (books[key].title === title) {
            matchingBooks.push({ isbn: key, ...books[key] });
        }
    }

    // Step 4: Return result
    if (matchingBooks.length > 0) {
        res.send(JSON.stringify(matchingBooks, null, 4));
    } else {
        res.status(404).send({ message: "No books found for the given title." });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        res.send(JSON.stringify(books[isbn].reviews, null, 4));  // Pretty-printed reviews
    } else {
        res.status(404).send({ message: "Book not found for the given ISBN." });
    }
});

module.exports.general = public_users;
