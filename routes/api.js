// api.js: will handle the direct interactions with the database.

// Routing refers to determining how an application responds to a client request to a particular endpoint,
// which is a URI (or path) and a specific HTTP request method (GET, POST, and so on).

// After installing an NPM package, that package must be "required" in the file where it will be used.
// Moment is a lightweight JavaScript date library for parsing, validating, manipulating, and formatting dates.
// It makes dealing with dates much easier.
const moment = require("moment")
const showdown = require("showdown")

// Importing the post.js file, which holds the BlogPostModel
const BlogPostModel = require("../models/post.js")

// module.exports is an object
// Inside that object, I'll create functions that can be imported and used in other files (specifically the /routes/index.js file in this case).
module.exports = {
    // FUNCTIONS WILL GO HERE
    // Each function will have a callback function as one of its parameters.
    // This will ensure that the route code waits until the database query is finished before sending the data back to the browser.

    // First, I get the current UNIX timestamp using the moment().unix() method from the Moment NPM package.
    // When I query the database for blog posts, I only want to return ones that have been published,
    // which excludes any with publish dates set for the future.
    // Then, the BlogPostModel.find() Mongoose query method is used to find all the blog posts with a 
    // dateTimestamp value less than the current timestamp (represented by moment().unix()). And the blog posts
    // are sorted by newest to oldest publish date ({dateTimestamp: -1})
    // The attached "title urlTitle dateTimestamp tags thumbnailImageUrl" string tells Mongoose
    // to only return those schema keys in the data it retrieves from the database.
    // This simply cuts back on the size of the data I am sending back to the browser.
    // The last thing is a function that adds some error handling.
    // If for some reason an error occurs during the query, the {getDataError: true} response is returned back to the browser.
    // If not, the list of blog posts is sent back.
    getAllBlogPosts: function (callback) {
        const now = moment().unix()

        BlogPostModel.find({ dateTimestamp: { $lte: now } }, "title urlTitle dateTimestamp tags thumbnailImageUrl")
            .sort({ dateTimestamp: -1 })
            .exec(function (error, posts) {
                if (error) {
                    callback({ getDataError: true })
                } else {
                    callback({ success: true, posts: posts })
                }
            })
    },
    getBlogPostsByTag: function (tag, callback) {
        const now = moment().unix()

        BlogPostModel.find({ tags: tag, dateTimestamp: { $lte: now } }, "title urlTitle dateTimestamp tags thumbnailImageUrl")
            .sort({ dateTimestamp: -1 })
            .exec(function (error, posts) {
                if (error) {
                    callback({ getDataError: true })
                } else {
                    callback({ success: true, posts: posts })
                }
            })
    },
    // Limiting the number of returned documents to five via the limit(5) code.
    getFiveNewestPosts: function (callback) {
        const now = moment().unix()

        BlogPostModel.find({ dateTimestamp: { $lte: now } }, "title urlTitle dateTimestamp tags thumbnailImageUrl")
            .sort({ dateTimestamp: -1 })
            .limit(5)
            .exec(function (error, posts) {
                if (error) {
                    callback({ getdataError: true })
                } else {
                    callback({ success: true, posts: posts })
                }
            })
    },
    // The findOne() Mongoose method is used for getting a single document from the MongoDB database.
    // The urlTitle schema key is used for the query.
    // As a result, Mongoose will return the one blog post in the database with the given urlTitle value.
    // If a blog post is not found with the requested urlTitle, a { notFoundError: true } response will be returned.
    // After the MongoDB document is found, the markdown content for the blog post is converted into HTML using the showdown NPM package.
    // When a blog post is created, the content will be in Markdown. 
    // Therefore, that Markdown should be converted into HTML before it's rendered on the website.
    // To do that, the makeHtml() method provided by the Showdown NPM package is used.
    getBlogPostByUrlTitle: function (urlTitle, callback) {
        BlogPostModel.findOne({ urlTitle: urlTitle }).exec(function (error, post) {
            if (error) {
                callback({ getDataError: true })
            } else if (!post) {
                callback({ notFoundError: true })
            } else {
                const markdownConverter = new showdown.Converter()
                post.markdownContent = markdownConverter.makeHtml(post.markdownContent)

                callback({ success: true, post: post })
            }
        })
    }
}