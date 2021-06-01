const connection = require("../configs/connection");
const mysql = require('mysql2');
const express = require('express');
const { result } = require("lodash");
const router = express.Router();

router.get("/viewreport",function(req,res){
  if (req.isAuthenticated() && req.user.ROLE==="TEACHER"){
  connection.query(`SELECT T.TEACHER_ID,T.NAME,T.EMAIL,P.PROJECT_ID, P.PROJECT_TITLE, P.MEMBERS_NO FROM TEACHER_DETAILS T,PROJECT_DETAILS P WHERE T.TEACHER_ID=P.TEACHER_ID AND T.USER_ID='${req.user.id}';`,function(err,result1){
    if(err){
      console.log("me",err);
    }else{
      console.log(result1);
      var detailArr = [];
      result1.forEach(subResult=>{
        const query1=`SELECT PROJECT_ID,NAME, LINK FROM STUDENT_DETAILS S, DOCUMENTS D WHERE S.PROJECT_ID='${subResult.PROJECT_ID}' AND D.PROJECT_ID='${subResult.PROJECT_ID}';`;
                  connection.query(query1,function(err,result2){
                    if("ne",err){
                      console.log(err);
                    }else{
                      console.log(result2);
                      var anObj = {
                        ...result2, PROJECT_TITLE:result1.PROJECT_TITLE
                      };
                      detailArr.push(anObj);
                    }
                  });
      });
      var Obb = {...[detailArr]};
      console.log(Obb);
      res.render("treport", Obb);
    }
  });
  }else{
    res.redirect("/teacheruser/login");
  }
});

module.exports = router;



// SELECT D.LINK,D.STATUS FROM PROJECT_DETAILS P,DOCUMENTS D WHERE P.PROJECT_ID=D.PROJECT_ID AND P.TEACHER_ID='${result1[0].id}';