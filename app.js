const express = require("express");
const bodyParser = require("body-parser");
const { urlencoded } = require("body-parser");
const flash = require('connect-flash');
const path= require('path');
const session = require('express-session');
const passport = require('passport');


const app = express();
app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.listen(3000,function(){
    console.log("Server has started and running ar port 3000");
})

//Express session middleware
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );
  
  // Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());
  
//Express middleware to connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
  });
  

app.get("/",function(req,res){
    res.render("intro",{});
})

