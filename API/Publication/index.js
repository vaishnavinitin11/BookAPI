const Router = require("express").Router();

const PublicationModel = require("../../database/publication");

/*
Route                 /publication
Description     ->    get all publications
Access          ->    PUBLIC
Parameters            none
Method                GET
*/
//self
Router.get("/", async(req, res) => {

    try {
        const getAllPublications = await PublicationModel.find();
        return res.json({ publications: getAllPublications });
    }
    catch (error) {
        return res.json({ error: error.message });
    }

    
});

/*
Route                 /publication
Description     ->    get specific publication
Access          ->    PUBLIC
Parameters            none
Method                GET
*/

Router.get("/:id", async (req,res) => {

    try {
        const getSpecificPublication =  await PublicationModel.findOne({ id: req.params.id, });
        

        if (!getSpecificPublication){
            return res.json({
                error: `No specific publication found for the ${req.params.id}`,
            });
        }

        return res.json({ publication: getSpecificPublication });
    }
    catch (error) {
        return res.json({ error: error.message });
    }

});

/*
Route                 /publication
Description     ->    to get a list of publications based on a book's isbn
Access          ->    PUBLIC
Parameters            isbn
Method                GET
*/

Router.get("/:isbn", async (req,res) => {

    try {
        const getSpecificPublications = await PublicationModel.findOne({
            ISBN: req.params.isbn
        });
        

        if (!getSpecificPublications){
            return res.json({
                error:`No publications found for the isbn of ${req.params.isbn}`,
            });
        }

        return res.json({publications: getSpecificPublications });
    }
    catch (error) {
        return res.json({ error: error.message });
    }

});

/*
Route                 /publication/new
Description     ->    add new publications
Access          ->    PUBLIC
Parameters            none
Method                POST
*/

Router.post("/new", (req, res) => {

    try {
        const { newPublication } = req.body;
        PublicationModel.create(newPublication);
        return res.json({ message: "publication was added!"});
    }
    catch (error) {
        return res.json({ error: error.message });
    }  
});

/*
Route                 /publication/update
Description     ->    update publication name using id
Access          ->    PUBLIC
Parameters            id
Method                PUT
*/

Router.put("/update/:id", async (req,res) => {

    try {
        const updatedPublication = await PublicationModel.findOneAndUpdate(
            {
                id: req.params.id,
            },
            {
                name: req.body.publicationName,
            },
            {
                new: true,
            }
        );

        // database.publications.forEach((publication) => {
        //     if (publication.id === req.params.id) {
        //         publication.name = req.body.publicationName;
        //         return;
        //     }
        // });

        return res.json ({ publications: updatedPublication });
    }
    catch (error) {
        return res.json({ error: error.message });
    }

});

/*
Route                 /publication/update/book
Description     ->    update/add new book to an publication
Access          ->    PUBLIC
Parameters            isbn
Method                PUT
*/

Router.put("/update/book/:isbn", async (req, res) => {

    try {
        //update the publication database

        const updatedPublication = await PublicationModel.findOneAndUpdate(
            {
                id: req.body.id,
            },
            {
                $addToSet: {
                    books: req.params.isbn,
                }
            },
            {
                new: true,
            }
        );

        // database.publications.forEach((publication) => {
        //     if (publication.id === req.body.id) {
        //         return publication.books.push(req.params.isbn);
        //     }
        // });


        //update the book database

        const updatedBook = await BookModel.findOneAndUpdate(
            {
                ISBN: req.params.isbn,
            },
            {
                $addToSet: {
                    publications: req.body.id,
                }
            },
            {
                new: true,
            }
        );

        // database.books.forEach((book) => {
        //     if (book.ISBN === req.params.isbn) {
        //         book.publication = req.body.id;
        //         return;
        //     }
        // });

        return res.json({
            books: updatedBook, 
            publications: updatedPublication,
            message: "Successfully updated publication", 
        });
    }
    catch (error) {
        return res.json({ error: error.message });
    }

});

/*
Route                 /publication/delete
Description     ->    delete a publication
Access          ->    PUBLIC
Parameters            id
Method                DELETE
*/

Router.delete("/delete/:id", async (req,res) => {

    try {
        const updatedPublicationDatabase = await PublicationModel.findOneAndDelete({
            id: parseInt(req.params.id)
        });
        
        // database.publications.filter(
        //     (publication) => publication.id !== parseInt(req.params.id)
        // );

        // database.publications = updatedPublicationDatabase;
        return res.json ({ publications: updatedPublicationDatabase });
    }
    catch (error) {
        return res.json({ error: error.message });
    }

});

/*
Route                 /publication/delete/book
Description     ->    delete a book from publication
Access          ->    PUBLIC
Parameters            isbn, publication id
Method                DELETE
*/ 

Router.delete("/delete/book/:isbn/:pubId", async (req, res) => {

    try {
        //update publication database
        const updatedPublication = await PublicationModel.findOneAndUpdate(
            {
                id: parseInt(req.params.pubId),
            },
            {
                $pull: {
                    books: req.params.isbn
                }
            },
            {
                new: true
            }
        );

        // database.publications.forEach((publication) => {
        //     if (publication.id === parseInt(req.params.pubId)){
        //         const newBooksList = publication.books.filter(
        //             (book) => book !== req.params.isbn
        //         );

        //         publication.books = newBooksList;
        //         return; 
        //     }
        // });
        

        //update book database
        const updatedBook = await BookModel.findOneAndUpdate({
            ISBN: req.params.isbn
        },
        {
            $pull: {
                publication: 0,
            }
        },
        {
            new: true,
        }
        );

        // database.books.forEach((book) => {
        //     if (book.ISBN === req.params.isbn){
        //         book.publication = 0; //no publication available
        //         return;
        //     }
        // });

        return res.json ({ books: database.books, publications: database.publications});
    }
    catch (error) {
        return res.json({ error: error.message });
    }

});

module.exports = Router;