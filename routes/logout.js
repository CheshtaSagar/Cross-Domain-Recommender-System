const express = require("express");
const router = express.Router();
const auth = require('../config/auth');
const isUser=auth.isUser;
const passport = require('passport');

// Logout handling
router.get("/",isUser, (req, res) => {
    req.logout(function(err){

        if (err)
        { 
            return next(err); 
        }

        req.flash("success_msg", "You are logged out");
        res.redirect("/");

    }); //passport middleware function
   
  });


  module.exports = router;  