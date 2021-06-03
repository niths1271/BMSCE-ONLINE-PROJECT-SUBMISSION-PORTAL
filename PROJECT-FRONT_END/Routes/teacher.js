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
      //console.log(result1);
      var namesObj=[];
      var docsObj=[];
      function getFinal(){
        return new Promise(function(resolve,reject){
           result1.forEach((result, index)=>{
        function names(){
          return new Promise(function(resolve,reject){
            const query1=`SELECT PROJECT_ID,NAME FROM STUDENT_DETAILS WHERE PROJECT_ID='${result.PROJECT_ID}';`;
            connection.query(query1,function(err,result2){
              if(err){
                console.log(err);
              }else{   
                //console.log(result2);
                resolve(result2);
              }
            });
          });      
      }
      function docs(){
        return new Promise(function(resolve,reject){
          const query2=`SELECT D.LINK,D.STATUS FROM DOCUMENTS D WHERE PROJECT_ID='${result.PROJECT_ID}'`;
          connection.query(query2,function(err,result2){
            if(err){
              console.log(err);
            }else{   
              //console.log(result2[0]);
              resolve(result2[0]);
            }
          });
        });      
    }
    names().then((name)=>{
      //namesObj.push(name);
      docs().then((doc)=>{
      docsObj.push([...name, doc, {TITLE:result1[0].PROJECT_TITLE}]);
      //console.log("z",docsObj); 
      console.log("holaaaa",index, " ", result1.length );
      if(index==result1.length-1){
        console.log("loop done");
        resolve();
      }
    });
    });
    
      // namesObj.push(await names());
      // docsObj.push(await docs());
       
       
    
    
      });
          
        });
      }
      getFinal().then(()=>{
        console.log("got", docsObj);
        res.render("treport",{tname:result1[0].NAME,temail:result1[0].EMAIL, values:docsObj});
      });
     
     // console.log("z",namesObj);
      
      
    }
  });
  }else{
    res.redirect("/teacheruser/login");
  }
});

module.exports = router;
