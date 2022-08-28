// index.js: will handle the URL endpoints that the website will use to make requests to the REST API.

// Routing refers to determining how an application responds to a client request to a particular endpoint,
// which is a URI (or path) and a specific HTTP request method (GET, POST, and so on).

// The four API routes that will be implemented are:
// 1. Get all of the published blog posts ordered by publish date.
// 2. Get all of the published blog posts that have a specific tag (i.e. javascript, css, html).
// 3. Get the five newest blog posts that have been published (displayed on the homepage).
// 4. Get one blog post based on the URL title value.

// require() is the easiest way to include modules that exist in separate files
// The basic functionality of require is that it reads a JavaScript file, 
// executes the file, and then proceeds to return the exports object
// require(express) imports the Express.js framework
// I save that into an express binding
const express = require("express")

const api = require("./api.js")

// express.Router() creates an Express instance that will be used as middleware in the application
const app = express.Router()

// API Route Structure: 
// app.METHOD(PATH, HANDLER) 
// Where: app is an instance of Express.js, METHOD is an HTTP request method in lowercase, PATH is a path on the server,
// HANDER is the function executed when route is matched.
// So, inside the route, I will make a GET request on the "/post/get-all-blog-posts" endpoint.
// The HANDLER is a callback function where I call the api.getAllBlogPosts() function inside of it.
// When that /routes/api.js function is done, I will send the response data back to the client and
// terminate the request-response cycle. 
// As a result, all the data for the blog posts will be sent back to the website,
// in the form of an array of objects.
app.get("/posts/get-all-blog-posts", function (req, res) {
    api.getAllBlogPosts(function (apiResponse) {
        res.json(apiResponse)
    })
})

// This route follows the same structure as the previous one. 
// It is a GET HTTP request on the "/posts/get-blog-posts-by-tag" URL endpoint
// The req.query.tag is data included in the request made from the browser and a parameter
// in the api.getBlogPostsByTag() function. When the api.getBlogPostsByTag() finishes querying 
// the database, the data is sent back to the browser via the res.json(apiResponse) method. 
app.get("/posts/get-blog-posts-by-tag", function (req, res) {
    api.getBlogPostsByTag(req.query.tag, function (apiResponse) {
        res.json(apiResponse)
    })
})

app.get("/posts/get-five-newest-posts", function (req, res) {
    api.getFiveNewestPosts(function (apiResponse) {
        res.json(apiResponse)
    })
})

// I pass in the req.query.urlTitle value that is sent with the request from the browser.
// This will be a string that looks like this: "my-blog-post-title".
app.get("/posts/get-blog-post-by-url-title", function (req, res) {
    api.getBlogPostByUrlTitle(req.query.urlTitle, function (apiResponse) {
        res.json(apiResponse)
    })
})

// Exporting the app Express middleware instance
module.exports = app