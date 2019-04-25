/*jshint esversion:6 */
const express = require("express");
const app = express();
const ejs = require("ejs");
const bodyParser = require("body-parser");
const request = require("request");
const mongoose = require("mongoose");

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost/restfull-blogApp", {
  useNewUrlParser: true
});

//check for mongoose db connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

//schema

const blogSchema = new mongoose.Schema({
  name: String,
  image: String,
  body: String,
  created: {type: Date, default:Date.now}

});



const Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//   name: "My first personal blog Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
//   image: "https://images.pexels.com/photos/2144326/pexels-photo-2144326.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
//   body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
// });

app.get("/",function(req,res){
  res.redirect("/blogs");
});


//INDEX ROUTE

app.get("/blogs", function(req, res){
  Blog.find({}, function(err, blogs){
    if(err){
      console.log("Error!!!");
    }else{
      res.render("index", {blogs:blogs});
    }
  });

});

//NEW ROUTE

app.get("/blogs/new", function(req, res){
  const body = req.body.blog;

  Blog.create({body}, function(err, newBlog){
    if (err){
      console.log("Error!!!");
    }else{
          res.render("new", {newBlog:newBlog});
    }

  });
});


//CREATE ROUTE



app.listen(3000, function(){
  console.log("Server is running on port 3000");
});
