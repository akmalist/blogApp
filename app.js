/*jshint esversion:6 */
const express = require("express");
const app = express();
const ejs = require("ejs");
const bodyParser = require("body-parser");
const request = require("request");
const mongoose = require("mongoose");
const methodOverride =require("method-override");
const expressSanitizer = require('express-sanitizer');


//app configs
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));



//mongoose model/configs
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
      res.render("new");
});


//CREATE ROUTE

app.post("/blogs", function(req,res){

  req.body.blog.body = req.sanitize(req.body.blog.body);

  Blog.create(req.body.blog, function(err, newBlog){
    if (err){
   res.render("new");
    }else{
       res.redirect("/blogs");
    }
  });


});

//SHOW ROUTE

app.get("/blogs/:id", function(req, res){
  Blog.findById(req.params.id, function(err,foundBlog){
    if(err){
      res.render("blog");
    }else{
        res.render("show", {blog: foundBlog});
    }
  });

});

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
  // req.body comes from form data
      // req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findById(req.params.id, function(err, foundBlog){
    if(err){
  res.redirect("/blogs");
    }else{
      res.render("edit", {blog: foundBlog});
    }
  });
});

//UPDATE ROUTE

app.put("/blogs/:id", function(req,res){
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
    if(err){
      res.redirect("/blogs");
    }else{
      //redirect to the blog with the id that we just edited
      res.redirect("/blogs/"+req.params.id);
    }
  });
});

// DELETE ROUTE

app.delete("/blogs/:id", function(req,res){
  Blog.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect("/blogs");
    }else{
      res.redirect("/blogs");
    }
  });
});



app.listen(3000, function(){
  console.log("Server is running on port 3000");
});




// Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
//  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
// Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
