const connection = require("../configs/connection");
const mysql = require('mysql2');
const getreportFinal=require("../controllers/getreportdocs");
const getprojFinal=require("../controllers/getprojdocs");
const express = require('express');
const {
  result,
  functions
} = require("lodash");
const router = express.Router();

router.get("/viewreport", function (req, res) {
  if (req.isAuthenticated() && req.user.ROLE === "TEACHER") {
    connection.query(`SELECT T.TEACHER_ID,T.NAME,T.EMAIL,P.PROJECT_TITLE,P.PROJECT_ID,P.MEMBERS_NO FROM TEACHER_DETAILS T,PROJECT_DETAILS P WHERE T.TEACHER_ID=P.TEACHER_ID AND T.USER_ID='${req.user.id}';`, function (err, result1) {
      if (err) {
        console.log(err);
      } else {
        //console.log(result1);
        var docsObj = [];
        getreportFinal(result1,docsObj).then(() => {
          console.log("got", docsObj);
          res.render("treport", {
            result: result1,
            values: docsObj
          });
        });
      }
    });
  } else {
    res.redirect("/teacheruser/login");
  }
});
router.get("/scheduleappointment", function (req, res) {
  if (req.isAuthenticated() && req.user.ROLE === "TEACHER"){
    connection.query(`SELECT T.TEACHER_ID, T.EMAIL, P.PROJECT_ID, P.PROJECT_TITLE FROM TEACHER_DETAILS T, PROJECT_DETAILS P WHERE T.TEACHER_ID=P.TEACHER_ID AND T.USER_ID='${req.user.id}';`, function(err, reslt){
      if(err){
        console.log(err);
      }else{
        //console.log("kiki",reslt);
        res.render("tappointment", {vals:reslt});
      }
    });
  }else{
    res.redirect("/teacheruser/login");
  }
 
});
router.get("/viewappointmentreqs", function (req, res) {
  if (req.isAuthenticated() && req.user.ROLE === "TEACHER") {
    connection.query(`SELECT P.PROJECT_TITLE, A.ADATE, A.TYPEOFAPP, A.PROJECT_ID, A.APPROVAL, A.SCHEDULED_BY_ADMIN FROM APPOINTMENT A, PROJECT_DETAILS P, TEACHER_DETAILS T WHERE A.PROJECT_ID = P.PROJECT_ID AND P.TEACHER_ID = T.TEACHER_ID AND T.TEACHER_ID ='${req.user.id}';`, function(err, reslt){
      if(err){
        console.log(err);
      }else{
        //console.log(reslt);
        res.render("tappointmentreqs", {vals:reslt});
      }
    });
  }else{
    res.redirect("/teacheruser/login");
  }
 
});
router.get("/viewproject", function (req, res) {
  if (req.isAuthenticated() && req.user.ROLE === "TEACHER") {
    connection.query(`SELECT T.TEACHER_ID,T.NAME,T.EMAIL,P.SECTION,P.PROJECT_TITLE,P.PROJECT_ID,P.MEMBERS_NO FROM TEACHER_DETAILS T,PROJECT_DETAILS P WHERE T.TEACHER_ID=P.TEACHER_ID AND T.USER_ID='${req.user.id}';`, function (err, result1) {
      if (err) {
        console.log(err);
      } else {
        //console.log(result1);
        var projdocsObj = [];
        getprojFinal(result1,projdocsObj).then(() => {
          console.log(projdocsObj);
          res.render("tviewprojects", {
            result:result1,
            docs:projdocsObj
          });
        });
      }
    });
  } else {
    res.redirect("/teacheruser/login");
  }
});

router.get("/viewproject/:projName",function(req,res){
  console.log(req.params.projName);
  connection.query(`SELECT P.PROJECT_TITLE,R.STRUCTURE FROM PROJECTS R,PROJECT_DETAILS P WHERE R.PROJECT_ID=P.PROJECT_ID AND P.PROJECT_TITLE='${req.params.projName}';`, function (err, result) {
    if (err) {
      console.log(err);
    } else {
        res.render("projectstructure",{
          result:result,
        });
      }
      });
    });


router.post("/viewreport", function (req, res) {
  console.log(req.body.approval);
  connection.query(`UPDATE DOCUMENTS SET STATUS='${req.body.approval}' WHERE PROJECT_ID='${req.body.projectId}'`, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log("Updated successfully");
      connection.query(`DELETE FROM DOCUMENTS WHERE STATUS="DISAPPROVED"`, function (err) {
        if (err) {
          console.log(err);
        } else {
          res.redirect("viewreport");
        }
      });
    }
  });
});


router.post("/scheduleappointment", function(req, res){
  
   console.log("lolo",req.body);
   var retDoc = req.body;
   var teams = Object.values(retDoc).filter((ano)=>{return ano.length==1});
   var inserted = 0;
   teams.forEach(team=>{
     var post = {     
        ADATE: retDoc.ADATE.substring(0,10) + " "+ retDoc.ADATE.substring(11),
        TYPEOFAPP: retDoc.TYPEOFAPP,
        PROJECT_ID:team,
        APPROVAL:"APPROVED",
        SCHEDULED_BY_ADMIN:1
     }
     connection.query('INSERT INTO APPOINTMENT SET ?', post, function(error, results, fields){
       if(error){
         console.log(error);
       }else{
         inserted +=1;
         console.log("successful!");
         if(inserted===teams.length){
           res.redirect("/teacher/scheduleappointment");
         }
       }
     });
   });
});


router.post("/viewappointmentreqs",function(req, res){
  console.log("kilikili", req.body, "lplp", req.body.approval);
   connection.query(`UPDATE APPOINTMENT SET APPROVAL='${req.body.approval}' WHERE PROJECT_ID='${req.body.projectId}' AND SCHEDULED_BY_ADMIN = 0`, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log("Updated successfully");
      connection.query(`DELETE FROM APPOINTMENT WHERE APPROVAL="DISAPPROVED"`, function (err) {
        if (err) {
          console.log(err);
        } else {
          res.redirect("/teacher/viewappointmentreqs");
        }
        });
    }
  });
});

module.exports = router;
