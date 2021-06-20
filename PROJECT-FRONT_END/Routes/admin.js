const connection = require("../configs/connection");
const mysql = require('mysql2');
const express = require('express');
const router = express.Router();
const insertMembers = require('../controllers/insertmembers');
var uuid = require('uuid');
const { report } = require(".");
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.get("/admindashboard", function(req, res) {
    if (req.isAuthenticated() && req.user.ROLE==="ADMIN") {
        res.render("admindb");
    } else {
        res.redirect("/adminuser/login");
    }
});


router.get("/addTeacher", function(req, res){
    if (req.isAuthenticated() && req.user.ROLE==="ADMIN") {
        res.render("addTeacher");
    }else{
        res.redirect("/adminuser/login");
    }
});

router.post("/addTeacher", function(req, res){
    console.log("mamu",req.body);
    var details = req.body;
    var pw = details.password;
    bcrypt.hash(pw, saltRounds, function(error, hash){
        if(error){
            console.log(error);
        }else{
            connection.query(`INSERT INTO USER_DETAILS SET ?`, {USERNAME:details.username,PASSWORD:hash, ROLE:details.role}, err=>{
        if(err){
            console.log(err);
        }else{
            console.log("1st insert success!");
            connection.query(`SELECT id FROM USER_DETAILS WHERE USERNAME='${details.username}';`, function(er, rs){
                if(er){
                    console.log(er);
                }else{
                    console.log(rs[0]);
                    connection.query(`INSERT INTO TEACHER_DETAILS SET ?`, {USER_ID:rs[0].id,EMAIL:details.email,PHONE_NO:details.phone, NAME:details.name}, eror=>{
                        if(eror){
                            console.log(eror);
                        }else{
                            console.log("2nd insert success!");
                            res.redirect("/admin/addTeacher");
                        }
                    });
                }
            });
        }
    });
        }
    });
    
});

module.exports = router;