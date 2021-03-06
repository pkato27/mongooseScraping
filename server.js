var express = require ("express");
var bodyParser = require ("body-parser");
var mongoose = require ("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server

var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");

// Require all models
// var db = require("./models");
var PORT = 3000;

// Initialize Express

var app = express();


// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));


// mongodb/mongoose setup
let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoosscrape";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);
let mongodbCon = mongoose.connection;
mongodbCon.on("connected", ()=> console.log("MongoDB connected"));



// Routes

// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with request
    axios.get("https://www.nytimes.com/section/us").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
  
      // Now, we grab every h2 within an article tag, and do the following:
      $("h2.headline").each(function(i, element) {
        // Save an empty result object
        var result = {};
      
  
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
         .children("a")
          .text();
        result.link = $(this)
          .children("a")
          .attr("href");
          
        

          console.log(result);
  
        //Create a new Article using the `result` object built from scraping
        // db.Article.create(result)
        //   .then(function(dbArticle) {
        //     // View the added result in the console
        //     console.log(dbArticle);
        //   })
        //   .catch(function(err) {
        //     // If an error occurred, send it to the client
        //     return res.json(err);
        //   });
      });
      // $("p.summary").each(function(i, element) {
      //   // Save an empty result object
      //   var result = {};
      //   result.summary = $(this)
      //    .children()
      //     .text();
      //     console.log(result);

      // });

  // Route for getting all Articles from the db
// app.get("/articles", function(req, res) {
//   // Grab every document in the Articles collection
//   db.Article.find({})
//     .then(function(dbArticle) {
//       // If we were able to successfully find Articles, send them back to the client
//       res.json(dbArticle);
//     })
//     .catch(function(err) {
//       // If an error occurred, send it to the client
//       res.json(err);
//     });
// });
      // If we were able to successfully scrape and save an Article, send a message to the client
      res.send("Scrape Complete");
    });
  });


  // Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });