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

/*
Route                 /book/new
Description     ->    add new books
Access          ->    PUBLIC
Parameters            none
Method                POST
*/

shapeAI.post("/book/new", (req,res) => {
    const { newBook } = req.body;
    database.books.push(newBook);
    return res.json({ books: database.books, message: "book was added!"});
});

/*
Route                 /author/new
Description     ->    add new author
Access          ->    PUBLIC
Parameters            none
Method                POST
*/

shapeAI.post("/author/new", (req, res) => {
    const { newAuthor } = req.body;
    database.authors.push(newAuthor);
    return res.json({ authors: database.authors, message: "author was added!"});
});

/*
Route                 /publication/new
Description     ->    add new publications
Access          ->    PUBLIC
Parameters            none
Method                POST
*/

shapeAI.post("/publication/new", (req, res) => {
    const { newPublication } = req.body;
    database.publications.push(newPublication);
    return res.json({ publications: database.publications, message: "publication was added!"});
});

/*
Route                 /book/update
Description     ->    update title of a book
Access          ->    PUBLIC
Parameters            tisbn
Method                PUT
*/

shapeAI.put("/book/update/:isbn", (req, res) => {
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            book.title = req.body.bookTitle;
            return;
        }
    });

    return res.json({ books: database.books });
});

/*
Route                 /book/author/update/:isbn
Description     ->    update/add new author
Access          ->    PUBLIC
Parameters            isbn
Method                PUT
*/

shapeAI.put("/book/author/update/:isbn", (req, res) => {
    // update the book database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) 
        return book.authors.push(req.body.newAuthor);
    });

    // update the author database
    database.authors.forEach((author) => {
        if (author.id === req.body.newAuthor)
        return author.books.push(req.params.isbn);
    });

    return res.json ({ 
        books: database.books, 
        authors: database.authors, 
        message:"New author was added", });
});

/*
Route                 /author/update
Description     ->    update author details
Access          ->    PUBLIC
Parameters            id
Method                PUT
*/

shapeAI.put("/author/update/:id", (req, res) => {
    database.authors.forEach((author) => {
        if (author.id === req.params.id) {
            author.name = req.body.authorName;
            return;
        }
    });

    return res.json({ authors: database.authors });
});

/*
Route                 /publication/update
Description     ->    update publication details
Access          ->    PUBLIC
Parameters            id
Method                PUT
*/

shapeAI.put("/publication/update/:id", (req,res) => {
    database.publications.forEach((publication) => {
        if (publication.id === req.params.id) {
            publication.name = req.body.publicationName;
            return;
        }
    });

    return res.json ({ publications: database.publications });
});

/*
Route                 /publication/update/book
Description     ->    update/add new book to an publication
Access          ->    PUBLIC
Parameters            isbn
Method                PUT
*/

shapeAI.put("/publication/update/book/:isbn", (req, res) => {
    //update the publication database
    database.publications.forEach((publication) => {
        if (publication.id === req.body.pubid) {
            return publication.books.push(req.params.isbn);
        }
    });

    //update the book database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            book.publication = req.body.pubid;
            return;
        }
    });

    return res.json({
        books: database.books, 
        publications: database.publications,
        message: "Successfully updated publication", 
    });

});

shapeAI.listen(3000, () => console.log("Server running!!"));