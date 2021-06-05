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
  res.render("tappointmentreqs");
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
});

module.exports = router;