const mongoose = require("mongoose");

// Creating a Publication Schema
const PublicationSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true, 
    },
    name: {
        type: String,
        required: true, 
    },
    books: {
        type: String,
        required: true, 
    },
})

// Create a Publication Model
const PublicationModel = mongoose.model("publications", PublicationSchema);

module.exports = PublicationModel;