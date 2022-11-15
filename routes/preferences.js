//page that appears after first login, asking for ratings

const express = require("express");
const router = express.Router();
const mysql = require("mysql")
const db = require("../config/dbConfig");

//rendering home page
router.get("/", (req, res) => {
    res.render("preferences");
  });



module.exports = router;