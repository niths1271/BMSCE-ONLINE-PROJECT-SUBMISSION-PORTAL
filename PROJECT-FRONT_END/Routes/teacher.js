const connection = require("../configs/connection");
const mysql = require('mysql2');
const express = require('express');
const { result } = require("lodash");
const router = express.Router();

router.get("/viewreport",function(req,res){
  if (req.isAuthenticated() && req.user.ROLE==="TEACHER"){
  connection.query(`SELECT T.TEACHER_ID,T.NAME,T.EMAIL,P.PROJECT_TITLE,P.PROJECT_ID,P.MEMBERS_NO FROM TEACHER_DETAILS T,PROJECT_DETAILS P WHERE T.TEACHER_ID=P.TEACHER_ID AND T.USER_ID='${req.user.id}';`,function(err,result1){
    if(err){
      console.log(err);
    }else{
      console.log(result1);
      result1.forEach((result)=>{
        const query1=`SELECT PROJECT_ID,NAME FROM STUDENT_DETAILS WHERE PROJECT_ID='${result.PROJECT_ID}';`;
        connection.query(query1,function(err,result2){
          if(err){
            console.log(err);
          }else{
            console.log(result2);
          }
        });
      }); 
      res.render("treport");
    }
  });
  }else{
    res.redirect("/teacheruser/login");
  }
});

module.exports = router;



// SELECT D.LINK,D.STATUS FROM PROJECT_DETAILS P,DOCUMENTS D WHERE P.PROJECT_ID=D.PROJECT_ID AND P.TEACHER_ID='${result1[0].id}';