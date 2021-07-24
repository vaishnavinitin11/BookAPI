const Router = require("express").Router();

const AuthorModel = require("../../database/author");
// ../ => relative paths


/*
Route                 /author
Description     ->    get all authors
Access          ->    PUBLIC
Parameters            none
Method                GET
*/

Router.get("/", async (req, res) => {

    try {
        const getAllAuthors = await AuthorModel.find();
        return res.json({authors: getAllAuthors });
    }
    catch (error) {
        return res.json({ error: error.message });
    }
   
});

/*
Route                 /author
Description     ->    get specific author
Access          ->    PUBLIC
Parameters            none
Method                GET
*/
//self
Router.get("/:id", async (req,res) => {

    try {
        const getSpecificAuthor = await AuthorModel.findOne({ id: req.params.id });
        
        
        if(!getSpecificAuthor){
            return res.json({
                error: `No specific author found ${req.params.id}`,
            });
        }

        return res.json({author: getSpecificAuthor });
    }
    catch (error) {
        return res.json({ error: error.message });
    }

    
});

/*
Route                 /author
Description     ->    to get a list of authors based on a book's isbn
Access          ->    PUBLIC
Parameters            isbn
Method                GET
*/

Router.get("/:isbn", async (req, res) => {

    try {
        const getSpecificAuthors = await AuthorModel.findOne({ISBN: req.params.isbn});

        if(!getSpecificAuthors){
            return res.json({
                error: `No author found for the book ${req.params.isbn}`,
            });
        }

        return res.json ({authors: getSpecificAuthors });
    }
    catch (error) {
        return res.json({ error: error.message });
    }

});

/*
Route                 /author/new
Description     ->    add new author
Access          ->    PUBLIC
Parameters            none
Method                POST
*/

Router.post("/new", (req, res) => {

    try {
        const { newAuthor } = req.body;
        AuthorModel.create(newAuthor);
        return res.json({ message: "author was added!"});
    }
    catch (error) {
        return res.json({ error: error.message });
    }

});

/*
Route                 /author/update
Description     ->    Update Author name using id
Access          ->    PUBLIC
Parameters            id
Method                PUT
*/

Router.put("/update/:id", async (req, res) => {

    try {
        const updatedAuthor = await AuthorModel.findOneAndUpdate(
            {
                id: req.params.id,
            },
            {
                name: req.body.authorName,
            },
            {
                new: true,
            }
        );
        
        
        // database.authors.forEach((author) => {
        //     if (author.id === req.params.id) {
        //         author.name = req.body.authorName;
        //         return;
        //     }
        // });

        return res.json({ authors: updatedAuthor });
    }
    catch (error) {
        return res.json({ error: error.message });
    }
    
    
});

/*
Route                 /author/delete
Description     ->    delete an author
Access          ->    PUBLIC
Parameters            id
Method                DELETE
*/ 

Router.delete("/delete/:id", async (req,res) => {

    try {
        const updatedAuthorDatabase = await AuthorModel.findOneAndDelete({
            id: parseInt(req.params.id)
        });
        
        // database.authors.filter(
        //     (author) => author.id !== parseInt(req.params.id)
        // );

        // database.authors = updatedAuthorDatabase;
        return res.json ({ authors: updatedAuthorDatabase });
    }
    catch (error) {
        return res.json({ error: error.message });
    }

});


module.exports = Router;