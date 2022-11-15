const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const mysql = require("mysql")
const db = require("../config/dbConfig");
const passport = require('passport');


//login handling
router.post("/", (req, res, next) => {
 
    passport.authenticate("local", {
      successRedirect: "/homepage",
      failureRedirect: "/",
      failureFlash: true,
    })(req, res, next);
  });



//first time login handling
router.get("/firstTimeLogin", (req, res) => {
  res.render("firstTimeLogin");
}); 

//first time login handling
router.post("/firstTimeLogin", (req, res, next) => {
 console.log("here");
  passport.authenticate("local", {
    successRedirect: "/preferences",
    failureRedirect: "/",
    failureFlash: true,
  })(req, res, next);
});


module.exports = router;


