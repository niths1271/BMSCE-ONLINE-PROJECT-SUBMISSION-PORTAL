const connection = require("../configs/connection");
const mysql = require('mysql2');
const express = require('express');
const router = express.Router();
const insertMembers = require('../controllers/insertmembers');
var uuid = require('uuid');

router.get("/submitprojectdetails", function(req, res) {
    if (req.isAuthenticated) {
        res.render("submitprojectdetails");
    } else {
        res.redirect("/suser/login");
    }
});

router.get("/report", function(req, res) {
    if (req.isAuthenticated) {
        connection.query(`SELECT PROJECT_TITLE FROM PROJECT_DETAILS WHERE USER_ID =  '${req.user.id}' ;`, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                res.render("report",{pname:result[0].PROJECT_TITLE});
            }
        });
    } else {
        res.redirect("/suser/login");
    }
});

router.post('/submitprojectdetails', function(req, res) {
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

router.post('/submitteamdetails', function(req, res) {
    console.log(req.body);
    connection.query(`SELECT PROJECT_ID,MEMBERS_NO FROM PROJECT_DETAILS WHERE USER_ID =  '${req.user.id}' ;`, function(err, result) {
        console.log(result);
        if (err) {
            console.log(err);
        } else {
            console.log(result[0].PROJECT_ID);
            console.log(result[0].MEMBERS_NO);
            insertMembers(result, result[0].MEMBERS_NO, res);
        }
    });
});

router.post('/report',function(req,res){
    let file=req.files.myFile
    console.log(file);
    var uuidname = uuid.v1(); // this is used for unique file name
                 var filesrc = 'http://127.0.0.1:3000/docs/'+uuidname+file.name;
                 connection.query(`SELECT PROJECT_ID FROM PROJECT_DETAILS WHERE USER_ID =  '${req.user.id}' ;`, function(err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        var insertData = {
                            PROJECT_ID:result[0].PROJECT_ID,
                            REPORT:filesrc,
                        };
                        connection.query('INSERT INTO DOCUMENTS SET ?',insertData, (err) => {
                         if (err) throw err
                         else{
                        file.mv('public/docs/'+uuidname+file.name);
                        console.log("Inserted Successfully");
                        
                         }
        });
                    }
                });
});

module.exports = router;