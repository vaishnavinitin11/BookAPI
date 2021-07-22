const mongoose = require("mongoose");

// Creating a Publication Schema
const PublicationSchema = mongoose.Schema({
    id: Number,
    name: String,
    books: [String],
})

// Create a Publication Model
const PublicationModel = mongoose.model(PublicationModel);

module.exports = PublicationModel;