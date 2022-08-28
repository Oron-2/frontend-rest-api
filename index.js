// This file serves as the entry point to the application.

// require() is the easiest way to include modules that exist in separate files
// The basic functionality of require is that it reads a JavaScript file, 
// executes the file, and then proceeds to return the exports object
// require(express) imports the Express.js framework
// I save that into an express binding
const express = require("express")
// Helmet helps to secure the Express app (the website) by setting various HTTP headers.
const helmet = require("helmet")
// Mongoose is an Object data/document mapper (ODM). It connects Node to the Mongo database.
// Mongoose will map data/documents into JavaScript objects.
const mongoose = require("mongoose")
// The Dotenv package helps with loading the variables from the .env file into the application
// so I can access them via process.env.DB_USERNAME or process.env.DB_PASSWORD in the code.
const dotenv = require("dotenv")
const path = require("path")

// Initiates the .env configuration file, which makes the variables from the .env file available to use.
dotenv.config()

// express() executes the express binding
// the result is saved into the app binding
// the returned value of express(), which in this case is represented
// by the app binding is a JS function that can be passed to callback functions, etc
const app = express()

// overriding the port by setting an environment variable 
const PORT = process.env.PORT || 5000

// The database username and password are stored in the below environment variables
// A template literal string is used to embed the variables directly into the string. 
// Note!!! I have placed the name of the database, which in this case is "blog" in the connection string.
const mongoString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@coding-blog.nk8osod.mongodb.net/blog?retryWrites=true&w=majority`

// Using that connection string, I connect to the MongoDB database using the mongoose.connect() method.
// The additional options, namely, useNewUrlParser, useCreateIndex and useUnifiedTopology
// are used to help avoid deprecation warnings that may arise.
mongoose.connect(mongoString, { useNewUrlParser: true, useUnifiedTopology: true })

// The below code listens for both any any errors to occur and the successful connection to the database.
// The mongoose.on() method is used to listen for those events.
// If an error occurs after the initial connection is made,
// I want to console.log() the error so we understand what happened.
mongoose.connection.on("error", function (error) {
    if (process.env.NODE_ENV === "development") {
        console.log(error)
    }
})

// And I also want to log a success message when the application initially connects to the database.
mongoose.connection.on("open", function () {
    console.log("Connected to MongoDB database.")
})

// The use() method will execute whatever is inside of it every single request.
// In this case, it initiates the helmet package.
app.use(helmet())

// Telling Express to use the API route file (/routes/index.js)
app.use(require("./routes/index.js"))

// The express.static() method tells Express to serve static files out of the directory with the given path.
// The express.static() method is placed inside a app.use() middleware declaration and Express is instructed to serve
// static files with a URL that looks like "/assets/filename.png"
// Path is a Node.js core module, so there is no need to install any NPM package for it to work.
// But, I do need to require() it in the file.
app.use("/assets", express.static(path.join(__dirname, "..", "..", "assets")))

// listen() binds and listens for connections on the specified host and port
// the host is the app binding and the specified port is 5000
app.listen(PORT, function () {
    console.log(`Express started on http://localhost:${PORT}; ` +
        "press Ctrl-C to terminate.")
})