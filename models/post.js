// Before building the REST API routes, 
// I need to give Mongoose a model for the blog posts collection
// so it can read documents when it interacts with the MongoDB database.
// This model will be used when retrieving data from the database

// I should require Mongoose in every model file
const mongoose = require("mongoose")

// Everything in Mongoose starts with a Schema. Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.
// The Schema is created with the new keyword followed by applying the Schema() class on mongoose: new mongoose.Schema()
// Then, this code is saved into a binding named after the schema: const BlogPostSchema.
// Each key in the BlogPostSchema code defines a property in the documents that will be added to the MongoDB database
const BlogPostSchema = new mongoose.Schema({
    // a unique identifier given to each blog post, in the form of a randomly generated string
    id: {
        type: String,
        unique: true
    },
    // the title of the blog post
    title: {
        type: String,
        unique: true
    },
    // the title that is in the URL for the blog post page (i.e. "blog-post-title")
    urlTitle: {
        type: String,
        unique: true
    },
    // the UNIX timestamp publish date of the blog post
    dateTimestamp: Number,
    // an array of tags (in the form of strings) associated with the given blog post
    tags: Array,
    // the URL to the thumbnail image for the blog post
    thumbnailImageUrl: String,
    // the markdown content for the page (in the form of a string) that will be converted to HTML before being rendered on the website
    markdownContent: String,
    // the value for the <meta> title element, which will be displayed in the browser tab and search engine results
    seoTitleTag: String,
    // the value for the <meta> description element, which will be used by search engines
    seoMetaDescription: String
}, { collection: "posts" })

// Defining a MongoDB Index with the .index() method applied on the BlogPostSchema
// Without indexes, MongoDB must perform a collection scan, i.e. scan every document in a collection, 
// to select those documents that match the query statement. If an appropriate index exists for a query,
// MongoDB can use the index to limit the number of documents it must inspect.
// For the BlogPostSchema, I will index both the id and urlTitle keys.
// Therefore, when I query the database using either of those keys, the query will be much faster and take less computing power.
// When the application starts up, Mongoose will automatically call createIndex for each defined index in the schema.
BlogPostSchema.index({ id: -1, urlTitle: 1 })

// To use the schema definition, I need to convert the BlogPostSchema into a Mongoose Model I can work with
// To do that, I pass it into the mongoose.model() method. 
// The first parameter is a string containing the name of my model, and after that, I pass in the name of the schema defined above. The first parameter is supposed to be singular, and the first letter capitalised.
// Mongoose will take that and create a collection called "posts”. It will pluralise and lowercase it. So, the first parameter in the mongoose.model() method is more like a label. 
// I then export the Model so I can require() and use it in other files where I interact with the database:
module.exports = mongoose.model("Post", BlogPostSchema)