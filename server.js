var express = require('express')
var bodyParser = require('body-parser')
var logger = require('morgan')
var mongoose = require('mongoose')

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require('axios')
var cheerio = require('cheerio')

// Require all models
var db = require('./models')

// var PORT = 3000;
var port = process.env.PORT || 3000

// Initialize Express
var app = express()

// Configure middleware

// Use morgan logger for logging requests
app.use(logger('dev'))
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }))
// Use express.static to serve the public folder as a static directory
app.use(express.static('public'))

mongoose.Promise = Promise
var databaseUri = 'mongodb://localhost/CryptoScraper'
if (process.env.MONGODB_URI) {
  databaseUri = process.env.MONGODB_URI
}
mongoose.connect(databaseUri, {
  useMongoClient: true
})

var test = mongoose.connection
test.on('error', function (err) {
  console.log('Mongoose Error:', err)
})

// var databaseUri ='mongodb://localhost/NYT';
// mongoose.Promise = Promise;
// // //=========================================================== #3 mongoDBmLab
// if(process.env.MONGODB_URI){
// 	mongoose.connect(process.env.MONGODB_URI)
// } else{
// // 	mongoose.connect(databaseUri);
// 	mongoose.connect("mongodb://localhost/NYT", {
//   		useMongoClient: true
// 	});
// }

//= ==========================================================
// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB 	WITHOUT HEROKU
// mongoose.Promise = Promise;
// mongoose.connect("mongodb://localhost/NYT", {
//   useMongoClient: true
// });
// Routes

// A GET route for scraping the echojs website
app.get('/scrape', function (req, res) {
  // First, we grab the body of the html with request
  axios.get('https://coinmarketcap.com/').then(function (response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    // console.log(response.data);
    var $ = cheerio.load(response.data)
    var results = []
    $('tbody tr').each(function (i, element) {
      var title = $(this).children('.currency-name').children('.currency-name-container').text().trim()
      var summary = $(this).children('.market-cap').data('sort')

      if (title && summary) {
        var dataToAdd = {
          title,
          summary
        }

        results.push(dataToAdd)
      }
    })
    res.json(results)
  })
})

app.post('/api/save', function (req, res) {
  // console.log(req.body);
  db.Article
    .create(req.body)
    .then(function (dbArticle) {
      // If we were able to successfully scrape and save an Article, send a message to the client
      // res.send(dbArticle);
      // res.send("Scrape Complete");
      console.log('Article saved') // CHECK SERVER.JS
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err)
    })
})

// Route for getting all Articles from the db
app.get('/articles', function (req, res) {
  // TODO: Finish the route so it grabs all of the articles
  db.Article
    .find({})
    .then(function (dbArticle) {
      res.json(dbArticle)
    })
    .catch(function (err) {
      res.json(err)
    })
})

app.delete('/api/article/:id', function (req, res) {
  db.Article
    .remove({ '_id': req.params.id })
    .then(function (dbArticle) {
      res.json(dbArticle)
    })
})

app.get('/articles/:id', function (req, res) {
  // TODO
  // ====
  // Finish the route so it finds one article using the req.params.id,
  // and run the populate method with "note",
  // then responds with the article with the note included
  db.Article
    .findOne({ '_id': req.params.id })
    .populate('comment')
    .then(function (dbArticle) {
      res.json(dbArticle)
    })
    .catch(function (err) {
      res.json(err)
    })
})

// ----------------- creating a comment
app.post('/api/new_comment/:id', function (req, res) {
  // TODO
  // ====
  // save the new note that gets posted to the Notes collection
  // then find an article from the req.params.id
  // and update it's "note" property with the _id of the new note
  db.Comment
    .create(req.body)
    .then(function (dbComment) {
      // res.json(dbArticle)
      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { comment: dbComment._id },
        { new: true } // ---------------- returns the new updated version of the table
      )
    })
    .then(function (dbArticle) {
      res.json(dbArticle)
    })
    .catch(function (err) {
      res.json(err)
    })
})

// ------------- delete a note
app.delete('/comment/:id', function (req, res) {
  db.Comment
    .remove({ '_id': req.params.id })
    .then(function (dbArticle) {
      res.json(dbArticle)
    })
})

// Route for grabbing a specific Article by id, populate it with it's note

// Start the server
app.listen(port, function () {
  console.log('App running on port ' + port + '!')
})
