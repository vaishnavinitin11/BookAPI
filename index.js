require("dotenv").config();

// Frame work
const express = require("express");
const mongoose = require("mongoose");

// Database
const database = require("./database/index");

// Models
const BookModel = require("./database/book");
const AuthorModel = require ("./database/author");
const PublicationModel = require("./database/publication");

// Initializing express
const shapeAI = express();

// Configurations
shapeAI.use(express.json());

// Establish Database Connection
mongoose.connect(process.env.MONGO_URL, 
    {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
    }
).then(() => console.log("connection established!!!!!!!"));

/*
Route                 /
Description     ->    get all books
Access          ->    PUBLIC
Parameters            NONE
Method                GET
*/

shapeAI.get("/", async (req, res) => {
    // Hello Change
    const getAllBooks = await BookModel.find();
    console.log(getAllBooks);
    return res.json(getAllBooks);
});

/*
Route                 /is
Description     ->    get specific book based on ISBN
Access          ->    PUBLIC
Parameters            isbn
Method                GET
*/

shapeAI.get("/is/:isbn", async (req, res) => {

    const getSpecificBook = await BookModel.findOne({ ISBN: req.params.isbn});


    if(!getSpecificBook){
        return res.json({ 
            error: `No book found for the ISBN of ${req.params.isbn}`,
        });
    }

    return res.json({ book: getSpecificBook });
});

/*
Route                 /c
Description     ->    get specific books based on category
Access          ->    PUBLIC
Parameters            category
Method                GET
*/

shapeAI.get("/c/:category", async (req, res) => {
    
    const getSpecificBooks = await BookModel.findOne({
        category: req.params.category,
    });
    
    //const getSpecificBooks = database.books.filter((book) => 
    // book.category.includes(req.params.category)
    //);

    if(!getSpecificBooks){
        return res.json({ 
            error: `No book found for the category of ${req.params.category}`,
        });
    }

    return res.json({ books: getSpecificBooks });
});

/*
Route                 /a
Description     ->    get specific books based on author
Access          ->    PUBLIC
Parameters            none
Method                GET
*/
//self
shapeAI.get("/a/:authors", async (req,res) => {
    const getSpecificBooks = await BookModel.findOne({
        authors: req.params.authors,
    });

    if(!getSpecificBooks){
        return res.json({
            error: `No book found for the category of ${req.params.authors}`,
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

shapeAI.get("/author", async (req, res) => {
    const getAllAuthors = await AuthorModel.find();
    return res.json({authors: getAllAuthors });
});

/*
Route                 /author
Description     ->    get specific author
Access          ->    PUBLIC
Parameters            none
Method                GET
*/
//self
shapeAI.get("/author/:id", async (req,res) => {
    const getSpecificAuthor = await AuthorModel.findOne({ id: req.params.id });
    
    
    if(!getSpecificAuthor){
        return res.json({
            error: `No specific author found ${req.params.id}`,
        });
    }

    return res.json({author: getSpecificAuthor });
});

/*
Route                 /author
Description     ->    to get a list of authors based on a book's isbn
Access          ->    PUBLIC
Parameters            isbn
Method                GET
*/

shapeAI.get("/author/:isbn", async (req, res) => {
    const getSpecificAuthors = await AuthorModel.findOne({ISBN: req.params.isbn});

    if(!getSpecificAuthors){
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
//self
shapeAI.get("/publication", async(req, res) => {
    const getAllPublications = await PublicationModel.find();
    return res.json({ publications: getAllPublications });
});

/*
Route                 /publication
Description     ->    get specific publication
Access          ->    PUBLIC
Parameters            none
Method                GET
*/

shapeAI.get("/publication/:id", async (req,res) => {
    const getSpecificPublication =  await PublicationModel.findOne({ id: req.params.id, });
    

    if (!getSpecificPublication){
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

shapeAI.get("/publication/:isbn", async (req,res) => {
    const getSpecificPublications = await PublicationModel.findOne({
        ISBN: req.params.isbn
    });
    

    if (!getSpecificPublications){
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

shapeAI.post("/book/new", async (req,res) => {
    const { newBook } = req.body;
    BookModel.create(newBook);
    return res.json({  message: "book was added!"});
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
    AuthorModel.create(newAuthor);
    return res.json({ message: "author was added!"});
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
    PublicationModel.create(newPublication);
    return res.json({ message: "publication was added!"});
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

/*
Route                 /book/delete
Description     ->    delete a book
Access          ->    PUBLIC
Parameters            isbn
Method                DELETE
*/

shapeAI.delete("/book/delete/:isbn", (req, res) => {
    
    const updatedBookDatabase = database.books.filter(
    (book) => book.ISBN !== req.params.isbn
    );

    database.books = updatedBookDatabase;
    return res.json ({books: database.books});
});

/*
Route                 /book/delete/author
Description     ->    delete an author from a book
Access          ->    PUBLIC
Parameters            isbn, author id
Method                DELETE
*/

shapeAI.delete("/book/delete/author/:isbn/:authorId", (req,res) => {
    
    //update the book database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            const newAuthorList = book.authors.filter(
                (author) => author !== parseInt(req.params.authorId)
            );
            book.authors = newAuthorList;
            return;
        }
    });

    //update author database
    database.authors.forEach((author) => {
        if (author.id === parseInt(req.params.authorId)) {
            const newBooksList = author.books.filter(
                (book) => book !== req.params.isbn
            );

            author.books = newBooksList;
            return;
        }
    });

    return res.json ({ 
        message: "author was deleted",
        book: database.books, 
        author: database.authors, 
        
    });
});

/*
Route                 /author/delete
Description     ->    delete an author
Access          ->    PUBLIC
Parameters            id
Method                DELETE
*/ 

shapeAI.delete("/author/delete/:id", (req,res) => {

    const updatedAuthorDatabase = database.authors.filter(
        (author) => author.id !== parseInt(req.params.id)
    );

    database.authors = updatedAuthorDatabase;
    return res.json ({ authors: database.authors });
});

/*
Route                 /publication/delete
Description     ->    delete a publication
Access          ->    PUBLIC
Parameters            id
Method                DELETE
*/

shapeAI.delete("/publication/delete/:id", (req,res) => {

    const updatedPublicationDatabase = database.publications.filter(
        (publication) => publication.id !== parseInt(req.params.id)
    );

    database.publications = updatedPublicationDatabase;
    return res.json ({ publications: database.publications });
});

/*
Route                 /publication/delete/book
Description     ->    delete an author
Access          ->    PUBLIC
Parameters            isbn, publication id
Method                DELETE
*/ 

shapeAI.delete("/publication/delete/book/:isbn/:pubId", (req, res) => {
    //update publication database
    database.publications.forEach((publication) => {
        if (publication.id === parseInt(req.params.pubId)){
            const newBooksList = publication.books.filter(
                (book) => book !== req.params.isbn
            );

            publication.books = newBooksList;
            return; 
        }
    });

    //update book database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn){
            book.publication = 0; //no publication available
            return;
        }
    });

    return res.json ({ books: database.books, publications: database.publications});
});


shapeAI.listen(3000, () => console.log("Server running!!"));

// Talk to mongodb in which mongodb undersands => Mongoose
// Talk to us in such way we understand => JavaScript