const connection = require("../configs/connection");
const mysql = require('mysql2');
const express=require('express');
const router=express.Router();
const insertMembers=require('../controllers/insertmembers');

router.get("/submitprojectdetails", function(req, res) {
    if (req.isAuthenticated) {
        res.render("submitprojectdetails");
    } else {
        res.redirect("/login");
    }
});

router.get("/report", function(req, res) {
    if (req.isAuthenticated) {
        res.render("report");
    } else {
        res.redirect("/login");
    }
});

app.post('/submitprojectdetails', function(req, res) {
    console.log(req.body);
    console.log(req.user);
    let i = 1;
    var post = {
        USER_ID: req.user.id,
        PROJECT_TITLE: req.body.projectitle,
        MEMBERS_NO: req.body.dropdown2,
        SECTION: req.body.dropdown1,
    };
    var query = connection.query('INSERT INTO PROJECT_DETAILS SET ?', post, function(error, results, fields) {
        if (error) {
            console.log(error);
        } else {
            console.log("Successfully Inserted Project Details of the New Team");
            res.render("submitteamdetails", { members: req.body.dropdown2, });
        }
    });
});

app.post('/submitteamdetails', function(req, res) {
    console.log(req.body);
    connection.query(`SELECT PROJECT_ID,MEMBERS_NO FROM PROJECT_DETAILS WHERE USER_ID =  '${req.user.id}' ;`, function(err, result) {
        console.log(result);
        if (err) {
            console.log(err);
        } else {
            console.log(result[0].PROJECT_ID);
            console.log(result[0].MEMBERS_NO);    
            insertMembers(result[0].MEMBERS_NO,res);
        }
    });
});

module.exports=router;