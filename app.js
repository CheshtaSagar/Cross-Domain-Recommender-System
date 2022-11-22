const express = require("express");
const bodyParser = require("body-parser");
const { urlencoded } = require("body-parser");
const flash = require('connect-flash');
const path= require('path');
const session = require('express-session');
const bcrypt = require("bcrypt");
const passport = require('passport');
const db = require("./config/dbConfig");
// Passport Config
require('./config/passport')(passport);


const app = express();
//setting up template engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//for getting data from body
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.set("view engine", "ejs");
app.use(express.static("public"));

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
  



app.listen(3000,function(){
    console.log("Server has started running at port 3000");
})


app.use("/", require('./routes/intro'));
app.use("/register", require('./routes/register'));
app.use("/login", require('./routes/login'));
app.use("/homepage", require('./routes/homepage'));
app.use("/logout", require('./routes/logout'));
app.use("/preferences", require('./routes/preferences'));
app.use("/rate", require('./routes/rate'));


