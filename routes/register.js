const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const mysql = require("mysql")
const db = require("../config/dbConfig");
const passport = require('passport');

router.post("/", async (req,res) => {
    console.log(req.body.username);
    

    const name = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const gender= req.body.gender;
    const age= req.body.age;
    
    let errors = [];
 

  //Validations for registration form
  if (!name || !email || !password || !gender || !age) {
    errors.push({ msg: "Please enter all fields" });
  }
  if (password.length < 5) {
    errors.push({ msg: "Password must be at least 5 characters" });
  }
  if (errors.length > 0) {
    res.render("intro", {
      errors, //    if entries are not according to validation render filled fields
      name,
      email,
      password,
      gender,
      age
    });

}
else
{

    bcrypt.genSalt(10, (err, salt) =>
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;


        db.getConnection( async (err, connection) => {
            if (err) 
            throw (err)
            
            const hashedPassword= hash;

            const sqlSearch = "SELECT * FROM crossdomain.user WHERE email = ?"
            const search_query = mysql.format(sqlSearch,[email])
            const sqlInsert = "INSERT INTO crossdomain.user VALUES (0,?,?,?,?,?)"
            const insert_query = mysql.format(sqlInsert,[name, email, hashedPassword, gender, age])
            // ? will be replaced by values
            // ?? will be replaced by string
            await connection.query (search_query, async (err, result) => {
                if (err) 
                throw (err)
                
                
                console.log("------> Search Results from Table")
                console.log(result.length)


                if (result.length != 0) {
                    connection.release()
                    console.log("------> User already exists")
                    req.flash("error_msg", "User Already Exists!");
                    res.redirect("/");
                } 
                else {
                await connection.query (insert_query, (err, result)=> {
                    connection.release()
                    if (err) throw (err)
                    console.log ("--------> Created new User");
                    console.log(result.insertId);
                    req.flash("success_msg", "Post deleted!");
                    res.redirect("/");

                })
            }
    }) 
            }); 

        }));

}
    
}) ;//end of app.post()


module.exports = router;



