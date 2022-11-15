//pge that appears after login

const express = require("express");
const router = express.Router();
const mysql = require("mysql")
const db = require("../config/dbConfig");

//rendering home page
router.get("/", (req, res) => {
    res.render("homepage");
  });



module.exports = router;