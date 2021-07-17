// Frame work
const express = require("express");

// Database
const database = require("./database/index");

// Initializing express
const shapeAI = express();

// Configurations
shapeAI.use(express.json());

/*
Route                 /
Description     ->    get all books
Access          ->    PUBLIC
Parameters            NONE
Method                GET
*/

shapeAI.get("/", (req, res) => {
    // Hello Change
    return res.json({ books: database.books });
});

/*
Route                 /is
Description     ->    get specific book based on ISBN
Access          ->    PUBLIC
Parameters            isbn
Method                GET
*/

shapeAI.get("/is/:isbn", (req, res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.ISBN === req.params.isbn
    );

    if(getSpecificBook.length === 0){
        return res.json({ 
            error: `No book found for the ISBN of ${req.params.isbn}`,
        });
    }

    return res.json({ book: getSpecificBook });
});

/*
Route                 /c
Description     ->    get specific book based on category
Access          ->    PUBLIC
Parameters            category
Method                GET
*/

shapeAI.get("/c/:category", (req, res) => {
    const getSpecificBooks = database.books.filter((book) => 
    book.category.includes(req.params.category)
    );

    if(getSpecificBooks.length === 0){
        return res.json({ 
            error: `No book found for the category of ${req.params.category}`,
        });
    }

    return res.json({ books: getSpecificBooks });
});

/*
Route                 /a
Description     ->    get specific book based on author
Access          ->    PUBLIC
Parameters            none
Method                GET
*/

shapeAI.get("/a/:authors", (req,res) => {
    const getSpecificBooks = database.books.filter(
        (book) => book.authors.includes(req.params.authors)
    );

    if(getSpecificBooks.length === 0){
        return res.json({
            error: `No book found for the category of ${req.params.author}`,
        });
    }

    return res.json({books: getSpecificBooks });
});

/*
Route                 /author
Description     ->    get all authors
Access          ->    PUBLIC
Parameters            none
Method                GET
*/

shapeAI.get("/author", (req, res) => {
    return res.json({authors: database.authors });
});

/*
Route                 /author
Description     ->    get specific author
Access          ->    PUBLIC
Parameters            none
Method                GET
*/

shapeAI.get("/author/:id", (req,res) => {
    const getSpecificBook = database.authors.filter(
        (author) => author.id === req.params.id
    );

    if(getSpecificBook.length === 0){
        return res.json({
            error: `No specific author found ${req.params.id}`,
        });
    }

    return res.json({author: getSpecificBook });
});

/*
Route                 /author
Description     ->    to get a list of authors based on a book's isbn
Access          ->    PUBLIC
Parameters            isbn
Method                GET
*/

shapeAI.get("/author/:isbn", (req, res) => {
    const getSpecificAuthors = database.authors.filter(
        (author) => author.books.includes(req.params.isbn)
    );

    if(getSpecificAuthors.length === 0){
        return res.json({
            error: `No author found for the book ${req.params.isbn}`,
        });
    }

    return res.json ({authors: getSpecificAuthors });

});

/*
Route                 /publication
Description     ->    get all publications
Access          ->    PUBLIC
Parameters            none
Method                GET
*/

shapeAI.get("/publication", (req, res) => {
    return res.json({ publications: database.publications });
});

/*
Route                 /publication
Description     ->    get specific publication
Access          ->    PUBLIC
Parameters            none
Method                GET
*/

shapeAI.get("/publication/:id", (req,res) => {
    const getSpecificPublication = database.publications.filter(
        (publication) => publication.id === req.params.id
    );

    if (getSpecificPublication.length === 0){
        return res.json({
            error: `No specific publication found for the ${req.params.id}`,
        });
    }

    return res.json({ publication: getSpecificPublication });

});

/*
Route                 /publication
Description     ->    to get a list of publications based on a book's isbn
Access          ->    PUBLIC
Parameters            isbn
Method                GET
*/

shapeAI.get("/publication/:isbn", (req,res) => {
    const getSpecificPublications = database.publications.filter(
        (publication) => publication.books.includes(req.params.isbn)
    );

    if (getSpecificPublications.length === 0){
        return res.json({
            error:`No publications found for the isbn of ${req.params.isbn}`,
        });
    }

    return res.json({publications: getSpecificPublications });
});

shapeAI.listen(3000, () => console.log("Server running!!"));