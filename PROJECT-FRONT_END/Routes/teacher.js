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
      var namesObj=[];
      var docsObj=[];
        function names(){
          return new Promise(function(resolve,reject){
            result1.forEach((result)=>{
            const query1=`SELECT PROJECT_ID,NAME FROM STUDENT_DETAILS WHERE PROJECT_ID='${result.PROJECT_ID}';`;
            connection.query(query1,function(err,result2){
              if(err){
                console.log(err);
              }else{   
                console.log(result2);
                namesObj.push(result2);
              }
            });
          });
             resolve(namesObj);
          });      
      }
      function docs(){
        return new Promise(function(resolve,reject){
          result1.forEach((result)=>{
          const query2=`SELECT D.LINK,D.STATUS FROM DOCUMENTS D WHERE PROJECT_ID='${result.PROJECT_ID}'`;
          connection.query(query2,function(err,result2){
            if(err){
              console.log(err);
            }else{   
              console.log(result2[0]);
              docsObj.push(result2[0]);
            }
          });
        });
        resolve(docsobj);
        });      
    }
<<<<<<< HEAD
    
      console.log(namesObj);
      console.log(docsObj); 
=======
    names().then((name)=>{
      namesObj.push(name);
      console.log("aa",namesObj);
    });
    docs().then((doc)=>{
      docsObj.push(doc);
      console.log("bb",docsObj);
    });
      // namesObj.push(await names());
      // docsObj.push(await docs());
       
       
    
    
      });
      console.log("z",namesObj);
      console.log("z",docsObj); 
>>>>>>> 526e03d4befa608b5bccb6d23e7bffdf26c73129
      res.render("treport",{tname:result1[0].NAME,temail:result1[0].EMAIL});
    }
  });
  }else{
    res.redirect("/teacheruser/login");
  }
});

module.exports = router;
