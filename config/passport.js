
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const mysql = require("mysql")
const db = require("./dbConfig");
const passport = require('passport');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      
      db.getConnection ( async (err, connection)=> {
        if (err) 
          throw (err)
   
        console.log("getConnection executed");
        console.log(email);
        console.log(password);
   
   
        const sqlSearch = "SELECT * FROM crossdomain.user WHERE email = ?"
        const search_query = mysql.format(sqlSearch,[email])
        await connection.query (search_query, async (err, result) => {
         


         if (err)
          throw (err)


         if (result.length == 0) {
          console.log("--------> User does not exist")
          return done(null, false, { message: 'That email is not registered' });
         } 
         else 
         {
            
            const hashedPassword = result[0].password
            //get the hashedPassword from result
            console.log("HashedPassword: " + hashedPassword);
            
            bcrypt.compare(password, hashedPassword, (err, isMatch) => {     ////user.pass is hashed one store in db
               if (err) throw err;
               
            if (isMatch) {
               console.log("---------> Login Successful")
               return done(null, result[0]);
           } 
           else {
               console.log("---------> Password Incorrect")
               return done(null, false, { message: 'Password incorrect' });
           } 
       
            });
          }


        });
      
      

      passport.serializeUser(function(user, done) {
        console.log("Serialized user:" + user.email + "  " + user.userId);
        done(null, user);
      });

      passport.deserializeUser(function(user, done){
        console.log('USER ID : ' + user.userId);
        connection.query('SELECT * FROM crossdomain.user WHERE userId = ?', [user.userId], function (err, rows){
            console.log("deserialized user:" + user.email + "  " + rows[0].userId);
            done(err, rows[0]);
        });
    });

    connection.release();
      
          
  });

    })

  )}

