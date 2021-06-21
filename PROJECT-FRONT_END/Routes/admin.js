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
     connection.query(`SELECT COUNT(*) AS TOTAL FROM USER_DETAILS`, function(err, result1) {
          if(err){
               console.log(err);
          }else{
     connection.query(`SELECT PROJECT_ID,PROJECT_TITLE,MEMBERS_NO,SECTION FROM PROJECT_DETAILS;`, function(err, result2) {
          if (err) {
              console.log(err);
          } else {
              connection.query(`SELECT DISTINCT NAME,USN,EMAIL,PHONE_NO FROM STUDENT_DETAILS`, function(err, result3) {
                  if (err) {
                      console.log(err);
                  } else {
                       console.log(result1);
                       console.log(result2);
                       console.log(result3);
                       let teachers=result1[0].TOTAL-result2.length-1;
                       res.render("admindb",{usersno:result1[0].TOTAL,project:result2,student:result3,teachers:teachers});
                  }
              });
          }
      });
     }
});
    }
});


router.get("/addTeacher", function(req, res){
    if (req.isAuthenticated() && req.user.ROLE==="ADMIN") {
        res.render("addTeacher");
    }else{
        res.redirect("/adminuser/login");
    }
});

router.get("/appointTeacher", function(req, res){
    if (req.isAuthenticated() && req.user.ROLE==="ADMIN"){
     connection.query(`SELECT TEACHER_ID,NAME,EMAIL,PHONE_NO FROM TEACHER_DETAILS;`, function(err, result) {
          if(err){
               console.log(err);
          }else{
               connection.query(`SELECT PROJECT_ID FROM PROJECT_DETAILS WHERE TEACHER_ID IS NULL;`, function(err, result1) {
                    if(err){
                         console.log(err);
                    }else{
                         res.render("appointTeacher",{teacher:result,project:result1});
                    }
               });
          }
     });
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

router.post("/appointTeacher", function(req, res){
     console.log(req.body);
     var result=Object.values(req.body);
     console.log(result);
     for(var i=1;i<result.length;i++){
             connection.query(`UPDATE PROJECT_DETAILS SET TEACHER_ID=${result[0]} WHERE PROJECT_ID=${result[i]}`, err=>{
         if(err){
             console.log(err);
         }else{
             console.log("Insert successful!");
         }
     });
}
res.redirect("/admin/appointTeacher");
});
        

module.exports = router;