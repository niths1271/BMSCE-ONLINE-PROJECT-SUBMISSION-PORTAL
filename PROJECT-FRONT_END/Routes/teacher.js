const connection = require("../configs/connection");
const mysql = require('mysql2');
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

        function getFinal() {
          return new Promise(function (resolve, reject) {
            result1.forEach((result, index) => {
              function names() {
                return new Promise(function (resolve, reject) {
                  const query1 = `SELECT PROJECT_ID,NAME FROM STUDENT_DETAILS WHERE PROJECT_ID='${result.PROJECT_ID}';`;
                  connection.query(query1, function (err, result2) {
                    if (err) {
                      console.log(err);
                    } else {
                      //console.log(result2);
                      resolve(result2);
                    }
                  });
                });
              }

              function docs() {
                return new Promise(function (resolve, reject) {
                  const query2 = `SELECT D.LINK,D.STATUS FROM DOCUMENTS D WHERE PROJECT_ID='${result.PROJECT_ID}'`;
                  connection.query(query2, function (err, result2) {
                    if (err) {
                      console.log(err);
                    } else {
                      //console.log(result2[0]);
                      if (result2.length > 0)
                        resolve(result2[0]);
                      else {
                        reject("No document uploaded for Project id:" + result.PROJECT_ID);
                      }
                    }
                  });
                });
              }
              names().then((name) => {
                //namesObj.push(name);
                docs().then((doc) => {
                  docsObj.push([...name, doc]);
                  if (index == result1.length - 1) {
                    console.log("loop done");
                    resolve();
                  }
                }, (err) => {
                  console.log(err);
                  docsObj.push([...name]);
                  if (index == result1.length - 1) {
                    console.log("loop done");
                    resolve();
                  }
                });
              });
            });
          });
        }
        getFinal().then(() => {
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

        function getFinal() {
          return new Promise(function (resolve, reject) {
            result1.forEach((result, index) => {
              function names() {
                return new Promise(function (resolve, reject) {
                  const query1 = `SELECT PROJECT_ID,NAME FROM STUDENT_DETAILS WHERE PROJECT_ID='${result.PROJECT_ID}';`;
                  connection.query(query1, function (err, result2) {
                    if (err) {
                      console.log(err);
                    } else {
                      //console.log(result2);
                      resolve(result2);
                    }
                  });
                });
              }

              function projdocs() {
                return new Promise(function (resolve, reject) {
                  const query2 = `SELECT LINK,STRUCTURE,STATUS FROM PROJECTS WHERE PROJECT_ID='${result.PROJECT_ID}'`;
                  connection.query(query2, function (err, result2) {
                    if (err) {
                      console.log(err);
                    } else {
                      //console.log(result2[0]);
                      if (result2.length > 0)
                        resolve(result2[0]);
                      else {
                        reject("No projectdocs uploaded for Project id:" + result.PROJECT_ID);
                      }
                    }
                  });
                });
              }
              names().then((name) => {
                //namesObj.push(name);
                projdocs().then((projdoc) => {
                  projdocsObj.push([...name, doc]);
                  if (index == result1.length - 1) {
                    console.log("loop done");
                    resolve();
                  }
                }, (err) => {
                  console.log(err);
                  projdocsObj.push([...name]);
                  if (index == result1.length - 1) {
                    console.log("loop done");
                    resolve();
                  }
                });
              });
            });
          });
        }
        getFinal().then(() => {
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