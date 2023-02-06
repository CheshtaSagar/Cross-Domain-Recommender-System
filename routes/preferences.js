//page that appears after first login, asking for ratings

const express = require("express");
const router = express.Router();
const mysql = require("mysql")
const db = require("../config/dbConfig");


//18 movies that have to be rated by user in the beginning
const movieNames = ['Sudden Death (1995)', 'Treasure Island (2012)', 'Blockers (2018)', 'Arrival (2016)', 'Spiral (2018)', 'The Purple Sea (2009)',
  'Fantastic Beasts And Where To Find Them (2016)', 'Invincible Iron Man, The (2007)', 'Annabelle (2014)', 'Battle For Haditha (2007)',
'Anything For Love (2016)', 'Death Note (2017)', 'Don\'t Breathe (2016)', 'Santa\'s Little Helper (2015)', 'Cats (1998)', 'Sherlock Holmes and Dr. Watson: Acquaintance (1979)', 'Bad Girls (1994)',
'Out Of The Past (1947)'];




//rendering home page
router.get("/", (req, res) => {
    
    res.render("preferences",{
      movieNames: movieNames
    });
  });



//submitting rating form  
router.post("/submit", async(req, res) => {
     
  const movieIds = [];
  db.getConnection ( async (err, connection)=> {
        if (err) 
          throw (err)

        console.log("Connection established");
        
        for(let i=0;i<movieNames.length;i++)
        {
          const movieName= movieNames[i];
          console.log(movieName);
          let mv = req.body[movieNames[i]];
          
        const sqlSearch = "SELECT * FROM crossdomain.movies WHERE title= ?";
        const search_query = mysql.format(sqlSearch, [movieName]);
        console.log(search_query);
              await connection.query (search_query, async (err, result)=> {
                if (err)
                throw err;

                if(result.length == 0)
                  console.log("Empty");
                  else
                  {
                    console.log(result[0].movieId);
                    movieIds.push(result[0].movieId);

                    mId = result[0].movieId;
                    const sqlInsert = "INSERT INTO crossdomain.ratings(userId, movieId, rating, timestamp) VALUES (?,?,?,?)"
                    const insert_query = mysql.format(sqlInsert,[req.user.userId, mId, mv, 0]);

                          await connection.query (insert_query, (err, response)=> {
                              if(err)
                              throw err;
                              else
                              {
                                console.log ("--------> Created new rating for this user");
                              }

                          });
                    
                  }
                
              });

        };

        connection.release();
        req.flash("success_msg", "All movies rated successfully!");
        res.redirect('/homepage');
        
        });
    

  });

  

module.exports = router;