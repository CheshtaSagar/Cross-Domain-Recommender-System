//for rating a movie
const express = require("express");
const router = express.Router();
const mysql = require("mysql")
const db = require("../config/dbConfig");


//route to rate movie
router.post('/',(req, res) => {
  var movieName = req.query.movieName;
  console.log(movieName);
  var movieRating = req.query.curRating;
  db.getConnection ( async (err, connection)=> {
    if (err) 
      throw (err)

    console.log("Connection established");
    
      
    const sqlSearch = "SELECT * FROM crossdomain.movies WHERE title= ?";
    const search_query = mysql.format(sqlSearch, [movieName]);
    console.log(search_query);
    
    await connection.query (search_query, async (err, result)=> {
        if (err)
        throw err;

    movieId = result[0].movieId;
    userId= req.user.userId;
    
    const sqlSearch1 = "SELECT * FROM crossdomain.ratings WHERE userId= ? and movieId = ?";
    const search_query1 = mysql.format(sqlSearch1, [userId, movieId]);

            await connection.query (search_query1, async (err, result1)=> {
                if (err)
                throw err;

                if(result1.length == 0)//user has not rated this movie previously
                {
                    const sqlInsert = "INSERT INTO crossdomain.ratings(userId, movieId, rating, timestamp) VALUES (?,?,?,?)";
                    const insert_query = mysql.format(sqlInsert,[userId, movieId, movieRating, 0]);

                    await connection.query (insert_query, async (err, done)=> {
                        if(err)
                        throw err;
                        else
                        {
                            console.log(userId + " rated movieId: " + movieId + " with rating "+ movieRating);
                            res.send({rating: movieRating});
                        }
                    });
                }
                else //there is an entry in ratings table
                {

                    const sqlUpdate = "UPDATE crossdomain.ratings SET rating = ? WHERE userId=? and movieId=?"
                    const update_query = mysql.format(sqlUpdate,[movieRating, userId, movieId ]);

                    await connection.query (update_query, async (err, done)=> {
                        if(err)
                        throw err;
                        else
                        {
                           
                            console.log(userId + " rated movieId: " + movieId + " with rating "+ movieRating);
                            res.send({rating: movieRating});
                        }
                    });

                }
            });


    });

    connection.release();
});

});

module.exports = router;  