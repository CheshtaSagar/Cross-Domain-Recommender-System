//page that appears after login

const express = require("express");
const router = express.Router();
const mysql = require("mysql")
const db = require("../config/dbConfig");


  

//for displaying homepage with books and movies recommendations 
router.get('/', findRecommendations);
  
  function findRecommendations(req, res) {
        
      // Use child_process.spawn method from 
      // child_process module and assign it
      // to variable spawn
      var spawn = require("child_process").spawn;
        
      console.log("here");
      var process = spawn('python',["./model/recommender.py",
      req.user.userId] );
      console.log("loading");
      
      process.stdout.on('data', function(data) {
          result = data.toString();
          
          output = result.split(/(\r\n)/);

          //console.log(output);

          output_books=[];
          output_movies=[];
          let i=0;

          for( ;i<output.length;i++)
          {
             if (output[i]=="\r\n")
             continue;

             if(output[i]=="booksendhere")
             break;

             output_books.push(output[i]);

          }

          for( ;i<output.length-1;i++)
          {
             if (output[i]=="\r\n" || output[i]=="booksendhere")
             continue;

             output_movies.push(output[i]);

          }

          console.log(output_books);
          console.log(output_movies);

          const mid = Math.ceil(output_movies.length / 2);

          movies1 = output_movies.splice(0, mid);   
          movies2 = output_movies.splice(-mid);
          res.render("homepage",
          { movies1: movies1,
            movies2: movies2,
            books: output_books
          });
      } )
  }

module.exports = router;