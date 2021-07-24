require("dotenv").config();

// Frame work
const express = require("express");
const mongoose = require("mongoose");

//Microservices Routes
const Books = require("./API/Book");
const Authors = require("./API/Author");
const Publications = require("./API/Publication");

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

//Initializing Microservices
shapeAI.use("/book", Books);
shapeAI.use("/author", Authors);
shapeAI.use("/publication", Publications);


shapeAI.listen(3000, () => console.log("Server running!!"));

// Talk to mongodb in which mongodb undersands => Mongoose
// Talk to us in such way we understand => JavaScript