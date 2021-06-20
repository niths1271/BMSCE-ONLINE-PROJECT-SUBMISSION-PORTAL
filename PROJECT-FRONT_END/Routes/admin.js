const connection = require("../configs/connection");
const mysql = require('mysql2');
const express = require('express');
const router = express.Router();
const insertMembers = require('../controllers/insertmembers');
var uuid = require('uuid');
const { report } = require(".");

router.get("/admindashboard", function(req, res) {
    if (req.isAuthenticated() && req.user.ROLE==="ADMIN") {
        res.render("admindb");
    } else {
        res.redirect("/adminuser/login");
    }
});

router.post("/admindashboard", function(req, res) {
     
})

module.exports = router;