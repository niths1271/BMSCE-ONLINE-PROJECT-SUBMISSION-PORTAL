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
        console.log(result1.length);
        if(result1.length==0){
          connection.query(`SELECT TEACHER_ID,NAME,EMAIL FROM TEACHER_DETAILS WHERE USER_ID='${req.user.id}';`, function (err, result2) {
            if(err){
              console.log(err);
            }else{
          res.render("treport", {
            result2: result1,
            result:result2,
          });
        }
        });
        }
        else{
        var docsObj = [];
        getreportFinal(result1,docsObj).then(() => {
          console.log("got", docsObj);
          res.render("treport", {
            result2:result1,
            result: result1,
            values: docsObj
          });
        });
      }
      }
    });
  } else {
    res.redirect("/teacheruser/login");
  }
});
router.get("/scheduleappointment", function (req, res) {
  if (req.isAuthenticated() && req.user.ROLE === "TEACHER"){
    connection.query(`SELECT T.TEACHER_ID,T.NAME,T.EMAIL,P.PROJECT_ID,P.PROJECT_TITLE FROM TEACHER_DETAILS T, PROJECT_DETAILS P WHERE T.TEACHER_ID=P.TEACHER_ID AND T.USER_ID='${req.user.id}';`, function(err, reslt){
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
        if(result1.length==0){
          connection.query(`SELECT TEACHER_ID,NAME,EMAIL FROM TEACHER_DETAILS WHERE USER_ID='${req.user.id}';`, function (err, result2) {
            if(err){
              console.log(err);
            }else{
          res.render("tviewprojects", {
            result2: result1,
            result:result2,
          });
        }
        });
        }else{
        var projdocsObj = [];
        getprojFinal(result1,projdocsObj).then(() => {
          console.log(projdocsObj);
          res.render("tviewprojects", {
            result2: result1,
            result:result1,
            docs:projdocsObj
          });
        });
      }
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

router.get("/grading", function(req, res){
  if (req.isAuthenticated() && req.user.ROLE === "TEACHER"){
    connection.query(`SELECT * FROM PROJECT_DETAILS WHERE TEACHER_ID='${req.user.id}';`, function(err, reslt){
      if(err){
        console.log(err);
      }else{
        console.log(reslt);
        res.render("grading", {vals:reslt});
      }
    });
  }else{
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

router.post("/grading", function(req, res){
  console.log("huki",req.body);
  connection.query(`SELECT * FROM STUDENT_DETAILS WHERE PROJECT_ID='${req.body.PROJECT_ID}';`, function(err, reslt){
    if(err){
      console.log(err);
    }else{
      connection.query(`SELECT * FROM GRADES WHERE PROJECT_ID = '${reslt[0].PROJECT_ID}'`, function(eror, resst){
        if(eror){
          console.log(eror);
        }else{
          res.render("tgrades", {vals:reslt, gds:resst, title:req.body.PROJECT_TITLE});
        }
      });
      
    }
  });
});

router.post("/fgrade", function(req, res){
  
  var grades = req.body;
  console.log("grade", grades);
  var inserted = 0;
  grades.STUD_IDs.forEach((student, index)=>{
    var html = parseInt(grades.HTML[index]);
    var css = parseInt(grades.CSS[index]);
    var js = parseInt(grades.JAVASCRIPT[index]);
    var report = parseInt(grades.REPORT[index]);
    var oc = parseInt(grades.ORALCOMMUNICATION[index]);
    var total = html + css+ js + oc + report;
    var marks = {
      HTML:html,
      JAVASCRIPT:js,
      CSS:css,
      REPORT:report,
      ORALCOMMUNICATION:oc,
      PROJECT_ID:parseInt(grades.PROJECT_ID[index]),
      STUDENT_ID:parseInt(student),
      TOTAL_SEE: total
    };
    console.log("niru",marks);
    connection.query(`INSERT INTO GRADES SET ?`, marks, function(error, result, fields){
      if(error){
        console.log(error);
      }else{
        console.log("inserted!");
        inserted = inserted +1;
      
        if(inserted===grades.STUD_IDs.length){
          connection.query(`UPDATE PROJECTS SET STATUS = 'GRADED' WHERE PROJECT_ID='${marks.PROJECT_ID}'`, function(errr, ress){
            if(errr){
              console.log(errr);
            }else{
              console.log("projects updated");
              res.redirect("/teacher/grading");
            }
          });
          
        }
      }
    });
  });
});

router.post("/patchgrade", function(req, res){
  console.log(req.body);
  var grades = req.body;
  var inserted = 0;
  grades.STUD_IDs.forEach((id, index)=>{
      var html = parseInt(grades.HTML[index]);
    var css = parseInt(grades.CSS[index]);
    var js = parseInt(grades.JAVASCRIPT[index]);
    var report = parseInt(grades.REPORT[index]);
    var oc = parseInt(grades.ORALCOMMUNICATION[index]);
    var total = html + css+ js + oc + report;
    
    connection.query(`UPDATE GRADES SET HTML = '${html}', CSS = '${css}', JAVASCRIPT = '${js}', REPORT = '${report}', ORALCOMMUNICATION = '${oc}',TOTAL_SEE='${total}' WHERE STUDENT_ID='${parseInt(id)}'`, function(error, reslt){
      if(error){
        console.log(error);
      }else{
        console.log("updated!");
        inserted = inserted +1;
      
        if(inserted===grades.STUD_IDs.length){
          res.redirect("/teacher/grading");
        }
      }
    });
  });
});

module.exports = router;
