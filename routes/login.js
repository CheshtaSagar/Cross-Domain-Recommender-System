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


/*
router.post("/", (req, res)=> {
    const email = req.body.email
    const password = req.body.password
    db.getConnection ( async (err, connection)=> {
     if (err) throw (err)

     console.log("Connection Established");
     console.log(email);
     console.log(password);


     const sqlSearch = "SELECT * FROM crossdomain.user WHERE email = ?"
     const search_query = mysql.format(sqlSearch,[email])
     await connection.query (search_query, async (err, result) => {
      connection.release()
      
      if (err) throw (err)

      console.log("------> Search Results")
      console.log(result.length)
      if (result.length == 0) {
       console.log("--------> User does not exist")
       res.sendStatus(404)
      } 
      else {
         const hashedPassword = result[0].password
         //get the hashedPassword from result
         console.log(hashedPassword);
         
         bcrypt.compare(password, hashedPassword, (err, isMatch) => {     ////user.pass is hashed one store in db
            if (err) throw err;
            
         if (isMatch) {
            console.log("---------> Login Successful")
            res.send(`${email} is logged in!`)
        } 
        else {
            console.log("---------> Password Incorrect")
            res.send("Password incorrect!")
        } 
         });
      }
    });
    }) 
    }) 


    */


module.exports = router;


